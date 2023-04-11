import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OperationService } from './services/operation.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { User } from './entities/user.entity';
import { MathParserService } from './services/math_parser.service';
import { HttpModule } from '@nestjs/axios';

console.log({
  OPERATION_DB_HOST: process.env.OPERATION_DB_HOST,
  OPERATION_DB_USER: process.env.OPERATION_DB_USER,
  OPERATION_DB_USER_PASSWORD: process.env.OPERATION_DB_USER_PASSWORD,
  OPERATION_DB_DATABASE: process.env.OPERATION_DB_DATABASE,
})
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.OPERATION_DB_HOST,
      port: Number(process.env.OPERATION_DB_PORT),
      username: process.env.OPERATION_DB_USER,
      password: process.env.OPERATION_DB_USER_PASSWORD,
      database: process.env.OPERATION_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      debug: true,
      logging:true,
    }),
    TypeOrmModule.forFeature([Operation, User]),
    ClientsModule.register([{
      name: 'REPORT_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'report-service-queue',
        queueOptions: {
          durable: true
        },
      }
    }]),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [MathParserService, OperationService],
})
export class AppModule { }
