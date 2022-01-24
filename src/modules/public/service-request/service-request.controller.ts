import { Controller, Get, Param } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';

@Controller('service-request')
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Get(':idTechnical')
  async find(@Param('idTechnical') id: number) {
    return {
      success: true,
      serviceRequests: await this.serviceRequestService.find(id),
    };
  }
}
