import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserDec } from '../../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwtAuth.guard';
import { IUserReq } from '../../../common/interfaces/user-req.interface';
import { ServiceRequestService } from './service-request.service';

@UseGuards(JwtAuthGuard)
@Controller('service-request')
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Get('')
  async find(@UserDec() user: IUserReq) {
    return {
      success: true,
      serviceRequests: await this.serviceRequestService.find(user),
    };
  }
}
