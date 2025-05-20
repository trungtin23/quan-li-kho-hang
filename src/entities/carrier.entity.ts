// src/entities/carrier.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Carrier {
  @PrimaryGeneratedColumn()
  carrierId: number;

  @Column()
  carrierName: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @OneToMany(() => Transaction, (transaction) => transaction.carrier)
  transactions: Transaction[];
}
