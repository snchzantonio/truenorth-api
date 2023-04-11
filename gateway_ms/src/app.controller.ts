import { Body, Query, Controller, Get, Inject, Post, UseGuards, Req, Param, Session, Version } from '@nestjs/common';
import { RemoteGuard } from './guards/remote.guard';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ComplexOperationDTO, DeleteRecordDTO, LoginUserDTO, RegisterUserDTO, ReportDTO, SimpleOperationDTO } from './dto';

@Controller({
  version: '1'
})
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
    @Inject('OPERATION_SERVICE')
    private readonly operationClient: ClientProxy,
    @Inject('REPORT_SERVICE')
    private readonly reportClient: ClientProxy,
  ) { }

  @Post('/user/register')
  async handleRegister(@Body() body: RegisterUserDTO) {
    console.log(body);
    let result;
    try {
      const { username, password } = body;
      result = await lastValueFrom(this.authClient.send('register', { username, password }));
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  @Post('/user/login')
  async handleLogin(@Body() body: LoginUserDTO) {
    console.log(body);
    let result;
    try {
      const { username, password } = body;
      result = await lastValueFrom(this.authClient.send('login', { username, password }));
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  @Post('/operation/simple')
  @UseGuards(RemoteGuard)
  async handleSimpleOperation(@Body() body: SimpleOperationDTO, @Session() session) {
    const { id: userId } = session.user;
    const { operator, operands } = body;
    console.log(body);
    const result = await lastValueFrom(this.operationClient.send('simple_operation', { userId, operator, operands }));
    return result;
  }

  @Post('/operation/complex')
  @UseGuards(RemoteGuard)
  async handleComplexOperation(@Body() body: ComplexOperationDTO, @Session() session) {
    const { id: userId } = session.user;
    const { mathExpression } = body;
    try {
      const result = await lastValueFrom(this.operationClient.send('complex_operation', { userId, mathExpression }));
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/operation/random-string')
  @UseGuards(RemoteGuard)
  async handleRandomStringOperation(@Session() session) {
    const { id: userId } = session.user;
    try {
      const result = await lastValueFrom(this.operationClient.send('random_string_operation', { userId }));
      console.log('result');
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/operation/report')
  @UseGuards(RemoteGuard)
  async handleReport(@Query() body: ReportDTO, @Session() session) {
    const reportOptions = {
      userId: session.user.id,
      ...body
    }
    console.log('reportOptions');
    console.log(reportOptions);
    return await lastValueFrom(this.reportClient.send('report', reportOptions));
  }

  @Post('/operation/:id/delete')
  @UseGuards(RemoteGuard)
  async handleDeleteRecord(@Session() session, @Param() params: DeleteRecordDTO) {
    const deleterRecordOptions = {
      userId: session.user.id,
      recordId: params.id
    }
    console.log('deleterRecordOptions');
    console.log(deleterRecordOptions);
    this.reportClient.emit('delete_record', deleterRecordOptions);
    return true;
  }
}
