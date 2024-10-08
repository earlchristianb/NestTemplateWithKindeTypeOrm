import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Author } from '../../author/entities/author.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Audiobook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 100,
  })
  title: string;

  @Column({
    nullable: false,
    length: 500,
  })
  description: string;

  @Column({
    nullable: false,
  })
  picture: string;

  @ManyToMany(() => Author, (author) => author.audiobooks)
  @JoinTable()
  authors: Author[];

  @ManyToMany(() => Product, (product) => product.items)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt?: Date;
}
