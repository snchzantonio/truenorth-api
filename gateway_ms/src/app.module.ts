import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'auth-service-queue',
          queueOptions: {
            durable: true
          },
        }
      },
      {
        name: 'OPERATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'operation-service-queue',
          queueOptions: {
            durable: true
          },
        }
      },
      {
        name: 'REPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'report-service-queue',
          queueOptions: {
            durable: true
          },
        }
      }
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
