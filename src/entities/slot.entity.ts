import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  slotId: number;

  @Column()
  warehouseId: number;

  @Column()
  row: string;

  @Column()
  column: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.slots)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @OneToMany(() => Product, (product) => product.slot)
  products: Product[];
}
