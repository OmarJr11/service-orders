import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEnum } from '../../../common/enum/roles.enum';
import { Status } from '../../../common/enum/status.enum';
import { DataProvider } from '../../../common/providers/data.provider';
import { ServiceRequest } from '../../../models/service-request.entity';
import { User } from '../../../models/user.entity';
import { UsersService } from '../../../modules/system/users/users.service';
import { Repository } from 'typeorm';
import { ServiceService } from '../service/service.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IUserReq } from '../../../common/interfaces/user-req.interface';

@Injectable()
export class ServiceRequestService extends DataProvider<ServiceRequest> {
  constructor(
    @Inject(REQUEST)
    private readonly _userRequest: Request,
    @InjectRepository(ServiceRequest)
    private readonly _serviceRequestRepository: Repository<ServiceRequest>,
    private readonly _servicesService: ServiceService,
    private readonly _usersService: UsersService,
  ) {
    super(_userRequest, _serviceRequestRepository);
  }

  /**
   * Create Service Request
   * @param {ServiceRequest} createServiceRequestDto - Dato to create service request
   * @returns {Promise<ServiceRequest>}
   */
  async create(
    createServiceRequestDto: CreateServiceRequestDto,
  ): Promise<ServiceRequest> {
    const technicians = await this._usersService.findAll(RolesEnum.TECHNICAL);

    const technical = this.getOneTechnicalRandom(
      this.getTechniciansAvailable(
        technicians,
        createServiceRequestDto.service,
      ),
    );
    const serviceRequest = await this.save({
      technical: technical.id,
      ticket: createServiceRequestDto.idTicket,
    }).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have Permission',
      });
    });

    return serviceRequest;
  }

  /**
   * Get All services requests of technical
   * @param user - user with role technical
   * @returns {Promise<ServiceRequest>}
   */
  async find(user: IUserReq): Promise<ServiceRequest[]> {
    await this._usersService.getUserWithRole(+user.userId, RolesEnum.TECHNICAL)

    const serviceRequests = await this._serviceRequestRepository
      .createQueryBuilder('SR')
      .leftJoinAndSelect('SR.ticket', 'TI')
      .leftJoinAndSelect('TI.service', 'S')
      .leftJoinAndSelect('TI.creator', 'C')
      .where('SR.technical = :technical', { technical: user.userId })
      .andWhere('SR.status = :status', { status: Status.ACTIVE })
      .getMany()
      .catch(() => {
        throw new ForbiddenException({
          success: false,
          message: 'You do not have Permission',
        });
      });

    return serviceRequests;
  }

  /**
   * Change status of Service request to Managed or Cancelled
   * @param {number} ticket - ticket id
   * @param {string} status - Status to change, Managed or Cancelled
   * @returns {Promise<ServiceRequest>}
   */
  async changeStatus(ticket: number, status: string): Promise<ServiceRequest> {
    const serviceRequest = await this._serviceRequestRepository
      .findOne({
        ticket,
      })
      .catch(() => {
        throw new ForbiddenException({
          success: false,
          message: 'Service Request not exist',
        });
      });

    const changeStatusServiceRequest = await this.updateEntity(serviceRequest, {
      status,
    }).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have Permission',
      });
    });

    return changeStatusServiceRequest;
  }

  /**
   * Get One Technical random
   * @param {User[]} technicians - Technicians Available
   * @returns {User}
   */
  private getOneTechnicalRandom(technicians: User[]): User {
    return technicians[Math.floor(Math.random() * technicians.length)];
  }

  /**
   * Get Technicians Available
   * @param technicians - Technicians
   * @param service - Service to run
   * @returns {User[]}
   */
  private getTechniciansAvailable(technicians: any[], service: string): User[] {
    const techniciansAvailable = [];
    for (const t of technicians) {
      t.services.map((s) => {
        if (s === service) {
          techniciansAvailable.push(t);
        }
      });
    }

    return techniciansAvailable;
  }
}
