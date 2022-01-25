import { ForbiddenException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Status } from '../../../common/enum/status.enum';
import { DataProvider } from '../../../common/providers/data.provider';
import { UserRole } from '../../../models/user-role.entity';
import { User } from '../../../models/user.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UserRolesService extends DataProvider<UserRole> {
  constructor(
    @Inject(REQUEST)
    private readonly _userRequest: Request,
    @InjectRepository(UserRole)
    private readonly _userRoleRepository: Repository<UserRole>,
  ) {
    super(_userRequest, _userRoleRepository);
  }

  /**
   * Create an association between a user and a role
   * @param {number} idUser - id user
   * @param {number} idRole - id of role
   */
  async createUserRole(idUser: number, idRole: number) {
    await this.save({ user: idUser, role: idRole }, idUser);
  }

  /**
   * Get user by id and role
   * @param {number} id user id
   * @param {string} type user role
   * @returns {Promise<number | User>}
   */
  async getUserWithRole(id: number, type: string): Promise<number | User> {
    const userRole = await this._userRoleRepository
      .createQueryBuilder('UR')
      .leftJoinAndSelect('UR.user', 'U', 'U.status = :status', {
        status: Status.ACTIVE,
      })
      .leftJoinAndSelect('UR.role', 'R', 'R.status = :status', {
        status: Status.ACTIVE,
      })
      .where('UR.status = :status', { status: Status.ACTIVE })
      .andWhere('U.id = :id', { id: Number(id) })
      .andWhere('R.name = :name', { name: type })
      .getOneOrFail()
      .catch(() => {
        throw new ForbiddenException(type + ' not exists');
      });

    return userRole.user;
  }

  
  /**
   * Get all user of a role
   * @param {string} type user role
   * @returns {Promise<number | User>}
   */
  async getUsersWithRole(type?: string): Promise<(number | User)[]> {
    const userRole = await this._userRoleRepository
      .createQueryBuilder('UR')
      .leftJoinAndSelect('UR.user', 'U', 'U.status = :status', {
        status: Status.ACTIVE,
      })
      .leftJoinAndSelect('UR.role', 'R', 'R.status = :status', {
        status: Status.ACTIVE,
      })
      .where('UR.status = :status', { status: Status.ACTIVE })
      .andWhere('R.name = :name', { name: type })
      .getMany();

    const users = [];
    userRole.map((ur) => {
      if (ur.user) {
        users.push(ur.user);
      }
    });

    return users;
  }
}
