import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../../common/enum/status.enum';
import { DataProvider } from '../../../common/providers/data.provider';
import { Service } from '../../../models/service.entity';
import { Not, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IUserReq } from '../../../common/interfaces/user-req.interface';
import { RolesEnum } from '../../../common/enum/roles.enum';
import { UserRolesService } from '../../../modules/system/user-roles/user-roles.service';

@Injectable()
export class ServiceService extends DataProvider<Service> {
  constructor(
    @Inject(REQUEST)
    private readonly _userRequest: Request,
    @InjectRepository(Service)
    private readonly _serviceRepository: Repository<Service>,
    private readonly _userRoleService: UserRolesService,
  ) {
    super(_userRequest, _serviceRepository);
  }

  /**
   * Create Service
   * @param {CreateServiceDto} createServiceDto - Data to create the service
   * @param {IUserReq} user - user logged
   * @returns {Promise<Service>}
   */
  async create(
    createServiceDto: CreateServiceDto,
    user: IUserReq,
  ): Promise<Service> {
    await this._userRoleService.getUserWithRole(user.userId, RolesEnum.ADMIN);
    await this.checkNameAlreadyExists(createServiceDto.name);

    const service = await this.save(createServiceDto).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have permission',
      });
    });

    return service;
  }

  /**
   * Get all services
   * @returns {Promise<Service>[]}
   */
  async findAll(): Promise<Service[]> {
    return await this._serviceRepository.find({
      where: { status: Not(Status.DELETED) },
    });
  }

  /**
   * Get service by id
   * @param {number} id - service id
   * @returns {Promise<Service>}
   */
  async findOne(id: number): Promise<Service> {
    const service = await this._serviceRepository
      .findOneOrFail({
        id,
        status: Not(Status.DELETED),
      })
      .catch(() => {
        throw new ForbiddenException({
          success: false,
          message: 'Service not exist',
        });
      });
    return service;
  }

  /**
   * Update Service
   * @param {number} id - Service id
   * @param {UpdateServiceDto} updateServiceDto - Data to Update the service
   * @param {IUserReq} user - User logged
   * @returns {Promise<Service>}
   */
  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    user: IUserReq,
  ): Promise<Service> {
    await this._userRoleService.getUserWithRole(user.userId, RolesEnum.ADMIN);
    const service = await this.findOne(id);

    if (service.name !== updateServiceDto.name) {
      await this.checkNameAlreadyExists(updateServiceDto.name);
    }

    const newService = await this.updateEntity(service, updateServiceDto).catch(
      () => {
        throw new ForbiddenException({
          success: false,
          message: 'You do not have permission',
        });
      },
    );

    return newService;
  }

  /**
   * Change status of service to Activate or Deactivate
   * @param {number} id - service id
   * @param {Status} status - service status
   * @param {IUserReq} user - user logged
   * @returns
   */
  async changeStatus(
    id: number,
    status: Status,
    user: IUserReq,
  ): Promise<Service> {
    await this._userRoleService.getUserWithRole(user.userId, RolesEnum.ADMIN);
    const service = await this.findOne(id);
    const newService = await this.updateEntity(service, status).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have permission',
      });
    });

    return newService;
  }

  /**
   * Delete service by id
   * @param {number} id - service id
   * @returns {Promise<Service>}
   */
  async remove(id: number, user: IUserReq): Promise<string> {
    await this._userRoleService.getUserWithRole(user.userId, RolesEnum.ADMIN);
    const service = await this.findOne(id);
    await this.deleteByStatus(service);
    return 'Service Deleted';
  }

  private async checkNameAlreadyExists(name: string) {
    const newName = await this._serviceRepository.findOne({
      name,
    });

    if (newName) {
      throw new ForbiddenException({
        success: false,
        message: 'Name already exists',
      });
    }
  }
}
