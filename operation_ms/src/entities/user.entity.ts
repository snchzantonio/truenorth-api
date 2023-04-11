import { Entity, Column } from 'typeorm';

@Entity('users')
export class User {
    @Column({ primary: true, generated: 'uuid', length: 36, type: 'varchar' })
    id: string;

    @Column({type: 'integer'})
    balance: number;

}