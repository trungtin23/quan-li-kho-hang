import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  supplierId: number;

  @Column()
  supplierName: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @OneToMany(() => Transaction, (transaction) => transaction.supplier)
  transactions: Transaction[];
}
