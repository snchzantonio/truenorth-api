import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload, ClientProxy } from '@nestjs/microservices';
import { OperationService } from './services/operation.service';
@Controller()
export class AppController {
  constructor(private readonly operationService: OperationService,
    @Inject('REPORT_SERVICE')
    private readonly reportService: ClientProxy,
  ) { }

  @MessagePattern('random_string_operation')
  async handleRandomStringOperation(@Payload() payload): Promise<any> {
    const { userId } = payload;
    const executeExpressionResult = await this.operationService.generateRandomString({ userId }) as { userBalance: number, status: boolean, error?: string, value?: string };
    const reportRecord = {
      operation_type: 'random_string',
      user_id: userId,
      amount: 1,
      user_balance: executeExpressionResult.userBalance,
      operation_response: executeExpressionResult.value || `error: ${executeExpressionResult.error}`,
      date: new Date().toISOString(),
    }
    console.log(reportRecord);
    this.reportService.emit('save_record', reportRecord);
    return executeExpressionResult;
  }

  @EventPattern('set_credit')
  async handleSetCredit(@Payload() payload): Promise<any> {
    const { userId, credit } = payload;
    this.operationService.setCredit({ userId, credit });
  }

  @MessagePattern('complex_operation')
  async handleComplexOperation(@Payload() payload): Promise<any> {
    const { userId, mathExpression } = payload;
    const executeExpressionResult = await this.operationService.executeComplexOperation(userId, mathExpression) as { userBalance: number, status: boolean, error?: string, value?: string };
    const reportRecord = {
      operation_type: 'complex',
      user_id: userId,
      amount: mathExpression,
      user_balance: executeExpressionResult.userBalance,
      operation_response: executeExpressionResult?.value === undefined ? executeExpressionResult.error : executeExpressionResult.value,
      date: new Date().toISOString(),
    }
    console.log('reportRecord');
    console.log(reportRecord);
    this.reportService.emit('save_record', reportRecord);
    return executeExpressionResult;
  }

  @MessagePattern('simple_operation')
  async handleSimpleOperation(@Payload() payload): Promise<any> {
    const { userId, operator, operands } = payload;
    console.log({ userId, operator, operands });
    const executeExpressionResult = await this.operationService.executeSimpleOperation(userId, operator, operands) as { userBalance: number, status: boolean, error?: string, value?: string };
    const reportRecord = {
      operation_type: operator,
      user_id: userId,
      amount: operands.join(', '),
      user_balance: executeExpressionResult.userBalance,
      operation_response: executeExpressionResult?.value === undefined ? `error: ${executeExpressionResult.error}` : executeExpressionResult.value,
      date: new Date().toISOString(),
    }

    console.log('reportRecord');
    console.log(reportRecord);
    console.log('executeExpressionResult');
    console.log(executeExpressionResult);
    this.reportService.emit('save_record', reportRecord);
    return executeExpressionResult;
  }


}
