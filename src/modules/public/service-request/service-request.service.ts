import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequest } from 'src/models/service-request.entity';
import { Repository } from 'typeorm';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

@Injectable()
export class ServiceRequestService {
  constructor(
    @InjectRepository(ServiceRequest)
    private readonly _serviceRequestRepository: Repository<ServiceRequest>,
  ) {}

  create(createServiceRequestDto: CreateServiceRequestDto) {
    return 'This action adds a new serviceRequest';
  }

  findAll() {
    return `This action returns all serviceRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceRequest`;
  }

  update(id: number, updateServiceResquestDto: UpdateServiceRequestDto) {
    return `This action updates a #${id} serviceRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceResquest`;
  }
}
