import { Column, Entity } from 'typeorm';

@Entity('<%= dbName %>')
export class <%= className %> {
  @Column({ generated: 'increment', name: 'id', nullable: false, primary: true, type: 'int', unsigned: true })
  id: number;

  @Column({ length: 30, name: 'nome', nullable: false, type: 'varchar' })
  name: string;

  @Column({ name: 'pessoa_id', type: 'int', unsigned: true })
  personId: number;

  @Column({ name: 'criado_por', nullable: false, type: 'int', unsigned: true })
  createdBy: number;

  @Column({ name: 'criado_em', nullable: false, type: 'datetime' })
  createdAt: Date;
}
