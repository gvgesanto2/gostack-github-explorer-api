import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('repository_collection_relations')
class RepositoryCollectionRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  collection_id: string;

  @Column('int')
  repository_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default RepositoryCollectionRelation;
