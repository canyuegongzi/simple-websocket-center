import {Entity, Column, PrimaryGeneratedColumn, ObjectIdColumn} from 'typeorm';

@Entity()
export class ImAddRequestEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  targetId: number;

  @Column()
  targetName: string;

  @Column()
  targetIcon: string;

  @Column()
  formId: number;

  @Column()
  type: string;

  @Column()
  note: string;

  @Column()
  state: boolean;

  @Column()
  callBackType: number; // 1 未应答 2： 同意  3： 不同意
}
