import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../../common/enum/status.enum';
import { DataProvider } from '../../../common/providers/data.provider';
import { Service } from '../../../models/service.entity';
import { Not, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService extends DataProvider<Service> {
  constructor(
    @InjectRepository(Service)
    private readonly _serviceRepository: Repository<Service>,
  ) {
    super(_serviceRepository);
  }

  /**
   * Create Service
   * @param {CreateServiceDto} createServiceDto - Data to create the service
   * @returns {Promise<Service>}
   */
  async create(createServiceDto: CreateServiceDto): Promise<Service> {
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
   * @param {UpdateServiceDto} updateServiceDto - Data to Update the service
   * @returns {Promise<Service>}
   */
  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
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
   * Delete service by id
   * @param {number} id - service id
   * @returns {Promise<Service>}
   */
  async remove(id: number): Promise<string> {
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
