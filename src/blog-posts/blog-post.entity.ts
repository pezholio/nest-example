import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('varchar')
  body: string;

  constructor(title?: string, body?: string) {
    this.title = title || '';
    this.body = body || '';
  }
}
