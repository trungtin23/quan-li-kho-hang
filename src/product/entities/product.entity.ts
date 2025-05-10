import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Product {
    constructor(
        public productId: number,
        public warehouseId: number,
        public slotId: number,
        public productName: string,
        public price: number,
        public stock: number,
        public description: string,  
        public timeReceive: Date,
        public timeDelivery: Date,
    ) {}
}
