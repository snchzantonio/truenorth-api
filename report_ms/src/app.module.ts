import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record_entity';
import { RecordService } from './services/record.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.REPORT_DB_HOST,
      port: Number(process.env.REPORT_DB_PORT),
      username: process.env.REPORT_DB_USER,
      password: process.env.REPORT_DB_USER_PASSWORD,
      database: process.env.REPORT_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      debug: false
    }),
    TypeOrmModule.forFeature([Record]),
  ],
  controllers: [AppController],
  providers: [RecordService],
})
export class AppModule { }
