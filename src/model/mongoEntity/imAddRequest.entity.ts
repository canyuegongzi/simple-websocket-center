import {Entity, Column, PrimaryGeneratedColumn, ObjectIdColumn} from 'typeorm';

@Entity()
export class ImAddRequestEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  targetId: string;

  @Column()
  targetName: string;

  @Column()
  userName: string;

  @Column()
  targetIcon: string;

  @Column()
  formId: string;

  @Column()
  type: string;

  @Column()
  note: string;

  @Column()
  state: boolean;

  @Column()
  createTime: number;

  @Column()
  updateTime: number;

  @Column()
  callBackType: number; // 1 未应答 2： 同意  3： 不同意
}
