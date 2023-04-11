import { Entity, Column, Index } from 'typeorm';

@Entity('records')
@Index(['user_id', 'active'])
@Index(['amount'], {fulltext: true})
export class Record {
    @Column({ primary: true, generated: 'uuid', length: 36, type: 'varchar' })
    id: string;

    @Column({ type: 'varchar' })
    operation_type: string;

    @Column({ generated: 'uuid', length: 36, type: 'varchar' })
    user_id: string;

    @Column()
    amount: string;

    @Column()
    user_balance: string;

    @Column()
    operation_response: string;

    @Column()
    date: string;

    @Column({ type: Boolean })
    active: boolean = true;

}