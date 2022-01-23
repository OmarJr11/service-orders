import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/common/enum/status.enum';
import { DataProvider } from 'src/common/providers/data.provider';
import { Service } from 'src/models/service.entity';
import { Not, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';

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
   * Delete service by id
   * @param {number} id - service id
   * @returns {Promise<Service>}
   */
  async remove(id: number): Promise<string> {
    const service = await this.findOne(id);
    await this.deleteByStatus(service);
    return 'Service Deleted';
  }
}
