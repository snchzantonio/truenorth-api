import { Entity, Column } from 'typeorm';

@Entity('users')
export class User {
    @Column({ primary: true, generated: 'uuid', length: 36, type: 'varchar' })
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ type: Boolean })
    active: boolean;
}