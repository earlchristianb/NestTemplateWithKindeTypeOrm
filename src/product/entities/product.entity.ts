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
import { ProductCurrency } from '../enum/product.enum';
import { Audiobook } from '../../audiobook/entities/audiobook.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 100,
  })
  title: string;

  @ManyToMany(() => Audiobook, (audiobook) => audiobook.products)
  @JoinTable()
  items: Audiobook[];

  @Column({
    nullable: false,
    length: 500,
  })
  description: string;

  @Column({
    nullable: false,
    length: 100,
  })
  @Column({
    nullable: false,
  })
  price: number;

  @Column({
    nullable: false,
    enum: ProductCurrency,
    default: ProductCurrency.PHP,
  })
  currency: string;

  @Column({
    nullable: false,
    default: false,
  })
  limitedTimeOffer: boolean;

  @Column({
    nullable: true,
  })
  startDate: Date;

  @Column({
    nullable: true,
  })
  endDate: Date;

  @Column({
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt?: Date;
}
