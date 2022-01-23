import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataProvider } from 'src/common/providers/data.provider';
import { RolesEnum } from 'src/common/enum/roles.enum';
import { Status } from 'src/common/enum/status.enum';
import { User } from 'src/models/user.entity';
import { ServiceService } from 'src/modules/public/service/service.service';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends DataProvider<User> {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _serviceService: ServiceService,
  ) {
    super(_userRepository);
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
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkPhoneExists(createUserDto.telephone);

    if (createUserDto.type === RolesEnum.TECHNICAL) {
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
    return newUser;
  }

  /**
   * Find All User or Find All User by type
   * @param {string} type - user type
   * @returns {Promise<User[]>}
   */
  async findAll(type?: string): Promise<User[]> {
    const options = type
      ? {
          type,
          status: Not(Status.DELETED),
        }
      : {
          status: Not(Status.DELETED),
        };
    const users = await this._userRepository.find(options).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'User not exist',
      });
    });

    return users;
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
   * Get User by id and type
   * @param {number} id - user id
   * @returns {Promise<User>}
   */
  async findOneByIdAndType(id: number, type: string): Promise<User> {
    const user = await this._userRepository
      .findOneOrFail({
        id,
        type,
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
   * Update user
   * @param {number} id - user id
   * @param {string} type - user type
   * @param {UpdateUserDto} updateUserDto - Data to update
   * @returns {Promise<User>}
   */
  async update(
    id: number,
    type: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOneByIdAndType(id, type);

    if (user.telephone !== updateUserDto.telephone) {
      await this.checkPhoneExists(updateUserDto.telephone);
    }

    if (type === RolesEnum.TECHNICAL) {
      if (!updateUserDto.services) {
        throw new ForbiddenException({
          success: false,
          message: 'Services must exist',
        });
      }
      const idsService = await this.getServices(updateUserDto.services);
      delete updateUserDto.services;
      updateUserDto.services = idsService;
    }

    const userUpdate = await this.updateEntity(
      user,
      updateUserDto,
      user.id,
    ).catch((error) => {
      console.log(error);
      throw new ForbiddenException({
        success: false,
        message: 'You do not have permission',
      });
    });

    if (userUpdate.type === RolesEnum.USER) {
      delete userUpdate.services;
    }

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
    console.log(id);

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
   * Check if phone exist
   * @param {string} phone - phone to check
   */
  private async checkPhoneExists(phone: string) {
    const telephone = await this._userRepository.findOne({
      where: {
        telephone: phone,
        status: Not(Status.DELETED),
      },
    });

    if (telephone) {
      throw new ForbiddenException({
        success: false,
        message: 'Phone already registered',
      });
    }
  }
}
