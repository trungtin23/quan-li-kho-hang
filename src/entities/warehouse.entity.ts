// src/entities/warehouse.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { Slot } from './slot.entity';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  warehouseId: number;

  @Column()
  warehouseType: string;

  @Column()
  location: string;

  @Column('float')
  acreage: number;

  @OneToMany(() => Product, (product) => product.warehouse)
  products: Product[];

  @OneToMany(() => Slot, (slot) => slot.warehouse)
  slots: Slot[];
}
