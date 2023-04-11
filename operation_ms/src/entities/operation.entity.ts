import { Entity, Column } from 'typeorm';

@Entity('operations')
export class Operation {
    @Column({ primary: true, generated: 'uuid', length: 36, type: 'varchar' })
    id: string;

    @Column({ unique: true })
    type: string;

    @Column()
    cost: string;

    @Column({ type: Boolean, default: true })
    active: boolean;

}