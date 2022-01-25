import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  Scope,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { DataProvider } from '../../../common/providers/data.provider';
import { RolesEnum } from '../../../common/enum/roles.enum';
import { Status } from '../../../common/enum/status.enum';
import { User } from '../../../models/user.entity';
import { ServiceService } from '../../../modules/public/service/service.service';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ConfigService } from '@nestjs/config';
import { TokensInterface } from '../../../common/interfaces/tokens.interface';
import { TokensService } from '../tokens/tokens.service';
import { RolesService } from '../roles/roles.service';
import { UserRolesService } from '../user-roles/user-roles.service';

@Injectable({ scope: Scope.REQUEST })
export class UsersService extends DataProvider<User> {
  constructor(
    @Inject(REQUEST)
    private readonly _userRequest: Request,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _configService: ConfigService,
    private readonly _serviceService: ServiceService,
    @Inject(forwardRef(() => TokensService))
    private readonly _tokenService: TokensService,
    private readonly _rolesService: RolesService,
    private readonly _userRolesService: UserRolesService,
  ) {
    super(_userRequest, _userRepository);
  }

  /**
   * Add Service to technical
   * @param {number} id - User id
   * @param {string} service - service to add
   * @returns {Promise<string[]>}
   */
  async addService(id: number, service: string): Promise<string[]> {
    const user = await this.findOne(id);

    const services = await this._serviceService.findAll();
    const index = services.findIndex((s) => s.name === service);

    if (user.services.findIndex((s) => s === services[index].name) !== -1) {
      throw new ForbiddenException({
        success: false,
        message: 'Service exist',
      });
    }

    if (index === -1) {
      throw new ForbiddenException({
        success: false,
        message: 'Service not exist',
      });
    }

    const newServices = [...user.services, services[index].name];

    const newUser = await this.updateEntity(
      user,
      {
        services: newServices,
      },
      user.id,
    ).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have permission',
      });
    });
    return newUser.services;
  }

  /**
   * Create User
   * @param {CreateUserDto} createUserDto - data to create user
   * @returns {Promise<User>}
   */
  @Transactional()
  async create(
    createUserDto: CreateUserDto,
    role: string = RolesEnum.USER,
  ): Promise<{ user: User; tokens: TokensInterface }> {
    await this.validateEmail(createUserDto.email);

    if (createUserDto.password) {
      createUserDto.password = await this.encryptPassword(
        createUserDto.password,
      );
    }

    if (role === RolesEnum.TECHNICAL) {
      if (!createUserDto.services) {
        throw new ForbiddenException({
          success: false,
          message: 'Services must exist',
        });
      }
      const idsService = await this.getServices(createUserDto.services);
      delete createUserDto.services;
      createUserDto.services = idsService;
    }

    const newUser = await this.save(createUserDto).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have permission',
      });
    });
    await this._rolesService.associateUserWithRole(newUser.id, role);

    return {
      user: newUser,
      tokens: await this._tokenService.generateTokensAndSaveThem(newUser),
    };
  }

  /**
   * Find All User or Find All User by type
   * @param {string} type - user type
   * @returns {Promise<User[]>}
   */
  async findAll(type?: string): Promise<(number | User)[]> {
    if (type) {
      return await this.getUsersWithRole(type);
    }
    return await this._userRepository.find().catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have permission',
      });
    });
  }

  /**
   * Get User by id
   * @param {number} id - user id
   * @returns {Promise<User>}
   */
  async findOne(id: number): Promise<User> {
    const user = await this._userRepository
      .findOneOrFail({
        id,
        status: Not(Status.DELETED),
      })
      .catch(() => {
        throw new ForbiddenException({
          success: false,
          message: 'User not exist',
        });
      });
    return user;
  }

  /**
   * Get user by email
   * @param {string} email - email of the user to be found
   * @returns {Promise<User[]>} - Users in system
   */
  async getByEmail(email: string): Promise<User> {
    const user = await this._userRepository
      .createQueryBuilder('U')
      .addSelect('U.password')
      .where('U.email = :email', { email })
      .andWhere('U.status <> :status', { status: Status.DELETED })
      .getOne();

    return user;
  }

  /**
   * Update user
   * @param {number} id - user id
   * @param {string} type - user type
   * @param {UpdateUserDto} updateUserDto - Data to update
   * @returns {Promise<User>}
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    await this.validateEmail(updateUserDto.email, +user.id);

    if (updateUserDto.password && updateUserDto.password.trim() !== '') {
      updateUserDto.password = await this.encryptPassword(
        updateUserDto.password,
      );
    }

    const userUpdate = await this.updateEntity(user, updateUserDto).catch(
      () => {
        throw new ForbiddenException({
          success: false,
          message: 'You do not have permission',
        });
      },
    );

    return userUpdate;
  }

  /**
   * Delete User
   * @param {number} id - user id
   * @returns {Promise<string>}
   */
  async remove(id: number): Promise<string> {
    const user = await this.findOne(id);
    await this.deleteByStatus(user);
    return 'User Deleted';
  }

  /**
   * Delete Service of User
   * @param {number} id - user id
   * @param {string} service - service to delete
   * @returns {Promise<string>}
   */
  async removeService(id: number, service: string): Promise<string[]> {
    const user = await this.findOne(id);
    const updateService = user.services.filter((s) => s !== service);

    const newUser = await this.updateEntity(
      user,
      {
        services: updateService,
      },
      user.id,
    ).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have permission',
      });
    });
    return newUser.services;
  }

  /**
   * Get user With role
   * @param {number} id - user id
   * @param {string} type - role type
   * @returns {Promise<number | User>}
   */
  async getUserWithRole(id: number, type: string): Promise<number | User> {
    return await this._userRolesService.getUserWithRole(id, type);
  }

  /**
   * Get all user of a role
   * @param {string} type - role type
   * @returns {Promise<number | User>}
   */
  async getUsersWithRole(type?: string): Promise<(number | User)[]> {
    return await this._userRolesService.getUsersWithRole(type);
  }

  /**
   * Get Services to save
   * @param {string[]} createServices - Service to create
   * @returns {Promise<string[]>}
   */
  private async getServices(createServices: string[]): Promise<string[]> {
    const services = await this._serviceService.findAll();
    const serviceToSave: string[] = [];
    createServices.map((s) => {
      const index = services.findIndex((service) => service.name === s);
      if (index !== -1) {
        serviceToSave.push(services[index].name);
      }
    });
    return serviceToSave;
  }

  /**
   * Encrypt a password
   * @param {string} password - password to encrypt
   * @return {Promise<string>} - password encrypted
   */
  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, +this._configService.get('SALT'));
  }

  /**
   * Validate if user Email is already in use
   * @param {string} email - email to be validated
   * @param {number} [id] - id of user, in case the user already exist,
   * the id of the user is used to prevent to find the same email of the user
   */
  private async validateEmail(email: string, id?: number) {
    const [, count] = id
      ? await this._userRepository.findAndCount({
          where: {
            email,
            id: Not(id),
            status: Not(Status.DELETED),
          },
        })
      : await this._userRepository.findAndCount({
          where: { email, status: Not(Status.DELETED) },
        });

    if (count > 0) {
      throw new NotAcceptableException({
        success: false,
        message: 'Email in use.',
      });
    }
  }
}
