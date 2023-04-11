import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './../entities/record_entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecordService {
    constructor(
        @InjectRepository(Record)
        private readonly recordRepository: Repository<Record>,
    ) {

    }

    save(record) {
        this.recordRepository.save({
            ...record,
            active: true,
        });
    }

    delete({ userId, recordId }) {
        this.recordRepository.update({ user_id: userId, id: recordId }, { active: false });
    }

    async getReport({ userId, page, perPage, sort, order, like }) {
        order = order != null && ['ASC', 'DESC'].includes(String(order).toUpperCase()) ? String(order).toUpperCase() : 'DESC';
        like = like != null ? String(like) : null;
        perPage = perPage == null ? 10 : perPage;
        page = page == null ? 1 : page;
        const take = perPage;
        const skip = perPage * (page - 1);

        console.log({ take, skip });
        let recordsQuery = await this.recordRepository
            .createQueryBuilder('record')
            .select('record.*')
            .where('active = 1 AND user_id=:userId', { userId });

        if (like != null) {
            recordsQuery = recordsQuery.andWhere('amount like :like', { like: '%' + like + '%' });
        }

        if (sort != null) {
            recordsQuery = recordsQuery.orderBy(sort, order);
        }

        try {
            const totalRecords = await recordsQuery.getCount();
            const records = await recordsQuery.limit(take).offset(skip).getRawMany();

            return {
                total: totalRecords,
                items: records,
            };
        } catch (error) {
            console.log(error);
            return {
                items: [],
                total: 0
            };
        }
    }
}