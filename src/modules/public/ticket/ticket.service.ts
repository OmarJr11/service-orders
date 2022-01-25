import { ForbiddenException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../../../models/ticket.entity';
import { Not, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { DataProvider } from '../../../common/providers/data.provider';
import { ServiceService } from '../service/service.service';
import { UsersService } from '../../../modules/system/users/users.service';
import { ServiceRequestService } from '../service-request/service-request.service';
import { Status } from '../../../common/enum/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IUserReq } from '../../../common/interfaces/user-req.interface';
import { UserRolesService } from '../../../modules/system/user-roles/user-roles.service';
import { RolesEnum } from '../../../common/enum/roles.enum';

@Injectable({ scope: Scope.REQUEST })
export class TicketService extends DataProvider<Ticket> {
  private readonly _relations = ['service', 'creator'];

  constructor(
    @Inject(REQUEST)
    private readonly _userRequest: Request,
    @InjectRepository(Ticket)
    private readonly _ticketRepository: Repository<Ticket>,
    private readonly _servicesService: ServiceService,
    private readonly _userService: UsersService,
    private readonly _serviceRequestService: ServiceRequestService,
    private readonly _userRolesService: UserRolesService,
  ) {
    super(_userRequest, _ticketRepository);
  }

  /**
   * Create Ticket
   * @param {CreateTicketDto} createTicketDto - data to create ticket
   * @param {IUserReq} userReq - user logged
   * @returns {Promise<Ticket>}
   */
  async create(
    createTicketDto: CreateTicketDto,
    userReq: IUserReq,
  ): Promise<Ticket> {
    await this._userRolesService.getUserWithRole(
      userReq.userId,
      RolesEnum.USER,
    );

    const service = await this._servicesService.findOne(
      createTicketDto.idService,
    );

    const ticket = await this.save(
      {
        service: service.id,
        token: await this.generateToken(100),
      },
      userReq.userId,
    ).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have Permission',
      });
    });

    await this._serviceRequestService.create({
      service: service.name,
      idTicket: +ticket.id,
    });

    return await this.findOne(ticket.id);
  }

  /**
   * Get all tickets
   * @returns {Promise<Ticket[]>}
   */
  async findAll(): Promise<Ticket[]> {
    const tickets = await this._ticketRepository
      .createQueryBuilder('T')
      .leftJoinAndSelect('T.service', 'S')
      .leftJoinAndSelect('T.creator', 'U')
      .where('T.status = :status', { status: Status.ACTIVE })
      .getMany();

    return tickets;
  }

  /**
   * Get Ticket by id
   * @param {number} id - ticket id
   * @returns {Promise<Ticket>}
   */
  async findOne(id: number): Promise<Ticket> {
    const ticket = await this._ticketRepository
      .findOneOrFail(
        {
          id,
          status: Not(Status.CANCELLED),
        },
        {
          relations: this._relations,
        },
      )
      .catch(() => {
        throw new ForbiddenException({
          success: false,
          message: 'Ticket Not exist',
        });
      });
    return ticket;
  }

  /**
   * Change ticket status to Managed or Cancelled
   * @param {number} id - ticket id
   * @param {string} status - ticket status, Managed or Cancelled
   * @param {IUserReq} userReq - user logged
   * @returns {Promise<Ticket>}
   */
  async changeStatus(
    id: number,
    status: string,
    user: IUserReq,
  ): Promise<Ticket> {
    const ticket = await this.findOne(id);

    const managedTicket = await this.updateEntity(
      ticket,
      {
        status,
      },
      user.userId,
    ).catch(() => {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have Permission',
      });
    });

    await this._serviceRequestService.changeStatus(ticket.id, status);

    return managedTicket;
  }

  /**
   * Generate Ticket token
   * @returns {Promise<string>}
   */
  private async generateToken(length: number): Promise<string> {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';

    let i = 1;
    let generateToken = '';

    // In case a ticket token already exist, it generates until a unique code is created
    do {
      for (let i = 0; i < length; i++) {
        generateToken += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
      // Verifying the newly generated code is not in the database
      const existCode = await this._ticketRepository
        .createQueryBuilder('T')
        .where('T.token = :token', { token: generateToken })
        .andWhere('T.status = :status', { status: Status.ACTIVE })
        .getOne();

      if (i === 3) {
        throw new ForbiddenException({
          success: false,
          message: 'You do not have permission on Ticket',
        });
      }
      i = existCode ? 0 : i + 1;
    } while (i === 0);

    return generateToken;
  }
}
