import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import Repository from './repository.model';

@Entity('issues')
class Issue {
  @PrimaryColumn('integer')
  id: number;

  @Column()
  title: string;

  @Column()
  html_url: string;

  @Column()
  user_login: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('integer')
  repository_id: number;

  @ManyToOne(() => Repository)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;
}

export default Issue;
