export class SearchProductResponse {
 constructor(
        public productId: number,
        public slotLocation: string,
        public productName: string,
        public price: number,
        public stock: number,
        public description: string,  
        public timeReceive: Date,
        public timeDelivery: Date,
    ) {}
}
