import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

// import Collection from './collection.model';

@Entity('repositories')
class Repository {
  @PrimaryColumn('int')
  id: number;

  @Column()
  full_name: string;

  @Column()
  description: string;

  @Column('json')
  owner: {
    login: string;
    avatar_url: string;
  };

  @Column('int')
  watchers_count: number;

  @Column('int')
  stargazers_count: number;

  @Column('int')
  forks_count: number;

  @Column('int')
  open_issues_count: number;

  @Column('json')
  issues: {
    id: number;
    title: string;
    html_url: string;
    user: {
      login: string;
    };
  }[];

  @Column('boolean')
  is_favorite: boolean;

  // @ManyToMany(() => Collection, { cascade: true })
  // @JoinTable({
  //   name: 'repository_collection_relations',
  //   joinColumn: {
  //     name: 'repository_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'collection_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // collections: Collection[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Repository;
