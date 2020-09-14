import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Repository from './repository.model';

import User from './user.model';

@Entity('collections')
class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @Column('uuid')
  owner_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column('boolean')
  is_public: boolean;

  @Column()
  public_title: string;

  @ManyToMany(() => Repository, { cascade: true })
  @JoinTable({
    name: 'repository_collection_relations',
    joinColumn: {
      name: 'collection_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'repository_id',
      referencedColumnName: 'id',
    },
  })
  repositories: Repository[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Collection;
