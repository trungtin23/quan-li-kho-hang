import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Slot {
  @PrimaryColumn()
  slotId: number;

  @Column()
  warehouseId: number;

  @Column()
  row: string;

  @Column()
  column: string;

  constructor(partial?: Partial<Slot>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
  @OneToMany(() => Product, (product) => product.slot)
  products: Product[];
}
