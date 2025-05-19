import { Slot } from 'src/slot/entities/slot.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  productId: number;

  @Column()
  warehouseId: number;

  @Column()
  slotId: number;

  @Column()
  productName: string;

  @Column('decimal')
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  timeReceive: Date;

  @Column({ type: 'datetime' })
  timeDelivery: Date;
  
  @ManyToOne(() => Slot, (slot) => slot.products)
  @JoinColumn({ name: 'slotId' })
  slot: Slot;
}
