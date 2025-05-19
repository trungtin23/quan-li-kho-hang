import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('warehouse')
export class Warehouse {
  @PrimaryGeneratedColumn()
  warehouseId: number;

  @Column()
  warehouseType: string;

  @Column()
  location: string;

  @Column()
  acreage: string;

  @Column()
  capacity: number;

  constructor(partial?: Partial<Warehouse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
