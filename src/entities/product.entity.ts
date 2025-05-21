// src/entities/product.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Slot } from './slot.entity';
import { TransactionDetail } from './transaction-detail.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  warehouseId: number;

  @Column()
  slotId: number;

  @Column()
  productName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column({ type: 'timestamp', nullable: true })
  timeReceive: Date;

  @Column({ type: 'timestamp', nullable: true })
  timeDelivery: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.products)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @ManyToOne(() => Slot, (slot) => slot.products)
  @JoinColumn({ name: 'slotId' })
  slot: Slot;

  @OneToMany(
    () => TransactionDetail,
    (transactionDetail) => transactionDetail.product,
  )
  transactionDetails: TransactionDetail[];
}
