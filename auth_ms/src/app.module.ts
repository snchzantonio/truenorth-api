import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

console.log({
  AUTH_DB_HOST: process.env.AUTH_DB_HOST,
  AUTH_DB_USER: process.env.AUTH_DB_USER,
  AUTH_DB_USER_PASSWORD: process.env.AUTH_DB_USER_PASSWORD,
  AUTH_DB_DATABASE: process.env.AUTH_DB_DATABASE,
})
@Module({
  imports: [
    ClientsModule.register([{
      name: 'OPERATION_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'operation-service-queue',
        queueOptions: {
          durable: true
        },
      }
    }
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.AUTH_DB_HOST,
      port: Number(process.env.AUTH_DB_PORT),
      username: process.env.AUTH_DB_USER,
      password: process.env.AUTH_DB_USER_PASSWORD,
      database: process.env.AUTH_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      debug: false//process.env.NODE_ENV != 'production'
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret',
      verifyOptions: {
        ignoreExpiration: process.env?.NODE_ENV != 'production'
      },
      signOptions: {
        expiresIn: '7d'
      },
    }),
  ],
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule { }
