export class SearchProductResponse {
  private priceRanges: { minPrice: number; maxPrice: number } = {
    minPrice: 0,
    maxPrice: 0,
  };
  private timeReceiveRanges: {
    minTimeReceive: string | null;
    maxTimeReceive: string | null;
  } = {
    minTimeReceive: null,
    maxTimeReceive: null,
  };
  private timeDeliveryRanges: {
    minTimeDelivery: string | null;
    maxTimeDelivery: string | null;
  } = {
    minTimeDelivery: null,
    maxTimeDelivery: null,
  };
  private slotRows: string[] = [];
  private slotColumns: string[] = [];

  setPriceRanges(minPrice: number, maxPrice: number) {
    this.priceRanges = { minPrice, maxPrice };
    return this;
  }

  setTimeReceiveRanges(
    minTimeReceive: Date | null,
    maxTimeReceive: Date | null,
  ) {
    this.timeReceiveRanges = {
      minTimeReceive: minTimeReceive ? minTimeReceive.toISOString() : null,
      maxTimeReceive: maxTimeReceive ? maxTimeReceive.toISOString() : null,
    };
    return this;
  }

  setTimeDeliveryRanges(
    minTimeDelivery: Date | null,
    maxTimeDelivery: Date | null,
  ) {
    this.timeDeliveryRanges = {
      minTimeDelivery: minTimeDelivery ? minTimeDelivery.toISOString() : null,
      maxTimeDelivery: maxTimeDelivery ? maxTimeDelivery.toISOString() : null,
    };
    return this;
  }

  setSlotRows(rows: string[]) {
    this.slotRows = rows;
    return this;
  }

  setSlotColumns(columns: string[]) {
    this.slotColumns = columns;
    return this;
  }

  build() {
    return {
      priceRanges: this.priceRanges,
      timeReceiveRanges: this.timeReceiveRanges,
      timeDeliveryRanges: this.timeDeliveryRanges,
      slotRows: this.slotRows,
      slotColumns: this.slotColumns,
    };
  }
}
