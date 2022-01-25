import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Request } from 'express';
import { UserRolesService } from '../user-roles/user-roles.service';
import { Status } from '../../../common/enum/status.enum';
import { DataProvider } from '../../../common/providers/data.provider';
import { Role } from '../../../models/role.entity';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class RolesService extends DataProvider<Role> {
  constructor(
    @Inject(REQUEST)
    private readonly _userRequest: Request,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    private readonly _userRolesService: UserRolesService,
  ) {
    super(_userRequest, _roleRepository);
  }

  /**
   * Associate a user with a role
   * @param {number} idUser - id of user to associate a role
   * @param {string} role - role to associate
   */
  async associateUserWithRole(idUser: number, role: string) {
    const dbRole = await this.findRoleByName(role);
    await this._userRolesService.createUserRole(idUser, dbRole.id);
  }

  /**
   * Verify if a specific user has a role
   * @param {number} idUser - id of user to verify
   * @param {string} role - role to verify
   * @returns {Promise<boolean>}
   */
  async userHasRole(idUser: number, role: string): Promise<boolean> {
    const [, count] = await this._roleRepository
      .createQueryBuilder('R')
      .innerJoin('R.userRoles', 'UR')
      .where('R.name = :role', { role })
      .andWhere('UR.user = :idUser', { idUser })
      .getManyAndCount();

    return count > 0;
  }

  /**
   * Find a role by its name
   * @param {string} role - role's name
   * @returns {Promise<Role>}
   */
  private async findRoleByName(role: string): Promise<Role> {
    return await this._roleRepository
      .findOneOrFail({
        where: { name: role, status: Not(Status.DELETED) },
      })
      .catch(() => {
        throw new NotFoundException({
          success: false,
          message: 'Role not found',
        });
      });
  }
}
