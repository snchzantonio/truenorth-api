import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy } from '@nestjs/microservices';
import { AuthService } from './services/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    @Inject('OPERATION_SERVICE')
    private readonly operationClient: ClientProxy,
  ) { }

  @MessagePattern('register')
  async registerUser(@Payload() payload): Promise<any> {
    const { username, password } = payload;
    const result = await this.authService.registerUser({ username, password });
    console.log(result);
    if (!result) {
      return { status: false, error: 'Unable to register the user' };
    }
    this.operationClient.emit('set_credit', { userId: result.id, credit: 9999 });
    return result;
  }

  @MessagePattern('login')
  loginUser(@Payload() payload): any {
    const { username, password } = payload;
    return this.authService.login({ username, password });
  }

  @MessagePattern('decode_jwt')
  decodeJWT(@Payload() jwtToken: string): any {
    console.log(jwtToken);
    const user = this.authService.decodeJWT(jwtToken);
    console.log(new Date().getTime() / 1000);
    console.log(user);
    return user;
  }

}
