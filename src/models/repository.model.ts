import { Column, Entity, PrimaryColumn } from 'typeorm';

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
  isFavorite: boolean;
}

export default Repository;
