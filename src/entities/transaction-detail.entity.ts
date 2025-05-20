// src/entities/transaction-detail.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from './product.entity';

@Entity()
export class TransactionDetail {
  @PrimaryGeneratedColumn()
  transactionDetailId: number;

  @Column()
  transactionId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionDetails)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @ManyToOne(() => Product, (product) => product.transactionDetails)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
