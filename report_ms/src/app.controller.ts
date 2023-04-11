import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { RecordService } from './services/record.service';
@Controller()
export class AppController {
  constructor(private readonly reportService: RecordService) { }

  @EventPattern('save_record')
  async handleGetRecord(@Payload() payload: any) {
    this.reportService.save(payload);
  }

  @EventPattern('delete_record')
  async handleDeleteRecord(@Payload() payload: any) {
    console.log('delete record options');
    console.log(payload);
    this.reportService.delete(payload);
  }

  @MessagePattern('report')
  async handleReport(@Payload() payload: any) {
    console.log('report');
    console.log(payload);
    return this.reportService.getReport(payload);
  }
}
