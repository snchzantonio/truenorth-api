import { Inject, Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class RemoteGuard implements CanActivate {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let token;
        try {
            console.log('checking auth header');
            token = request.headers.authorization.split(/^bearer\s/i)[1];
        } catch (error) {
            throw new BadRequestException('Missing or wrong authorization header');
        }
        console.log(token);
        let user;
        try {
            user = await lastValueFrom(this.authService.send('decode_jwt', token).pipe(timeout(10000)));
        } catch (error) {
            console.log(error);
        }
        console.log(user);
        if (!user) {
            throw new UnauthorizedException('Unable to authorize the user');
        }
        request.session = request.session || {};
        request.session.user = user;
        return true;
    }
}