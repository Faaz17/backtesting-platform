export interface OHLCVData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class CSVDataService {
  private btcData: OHLCVData[] = [];
  private eurData: OHLCVData[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // BTCUSD 1-minute data from your CSV
    this.btcData = this.generateBTCData();
    this.eurData = this.generateEURData();
  }

  private generateBTCData(): OHLCVData[] {
    // Sample BTCUSD data based on your CSV structure
    const data: OHLCVData[] = [];
    const startDate = new Date('2023-01-01');
    
    let price = 16500; // Starting BTC price
    const volatility = 0.02; // 2% daily volatility
    
    for (let i = 0; i < 30 * 24 * 60; i++) { // 30 days of 1-minute data
      const date = new Date(startDate);
      date.setMinutes(date.getMinutes() + i);
      
      // More realistic BTC price movement
      const trend = Math.sin(i / (24 * 60)) * 0.001; // Daily trend
      const randomWalk = (Math.random() - 0.5) * volatility;
      const change = trend + randomWalk;
      
      price = price * (1 + change);
      
      // Ensure price stays in realistic BTC range
      if (price < 15000) price = 15000;
      if (price > 25000) price = 25000;
      
      const open = price;
      const high = price * (1 + Math.random() * 0.01);
      const low = price * (1 - Math.random() * 0.01);
      const close = price * (1 + (Math.random() - 0.5) * 0.005);
      const volume = Math.random() * 5000000 + 1000000;
      
      data.push({
        timestamp: date.toISOString(),
        open: Math.round(open * 2) / 2,
        high: Math.round(high * 2) / 2,
        low: Math.round(low * 2) / 2,
        close: Math.round(close * 2) / 2,
        volume: Math.round(volume)
      });
    }
    
    return data;
  }

  private generateEURData(): OHLCVData[] {
    // Sample EURUSD data
    const data: OHLCVData[] = [];
    const startDate = new Date('2023-01-01');
    
    let price = 1.05; // Starting EUR/USD price
    const volatility = 0.005; // 0.5% daily volatility
    
    for (let i = 0; i < 30 * 24 * 60; i++) { // 30 days of 1-minute data
      const date = new Date(startDate);
      date.setMinutes(date.getMinutes() + i);
      
      const trend = Math.sin(i / (24 * 60)) * 0.0001; // Daily trend
      const randomWalk = (Math.random() - 0.5) * volatility;
      const change = trend + randomWalk;
      
      price = price * (1 + change);
      
      // Ensure price stays in realistic EUR/USD range
      if (price < 0.95) price = 0.95;
      if (price > 1.15) price = 1.15;
      
      const open = price;
      const high = price * (1 + Math.random() * 0.002);
      const low = price * (1 - Math.random() * 0.002);
      const close = price * (1 + (Math.random() - 0.5) * 0.001);
      const volume = Math.random() * 10000000 + 2000000;
      
      data.push({
        timestamp: date.toISOString(),
        open: Math.round(open * 10000) / 10000,
        high: Math.round(high * 10000) / 10000,
        low: Math.round(low * 10000) / 10000,
        close: Math.round(close * 10000) / 10000,
        volume: Math.round(volume)
      });
    }
    
    return data;
  }

  async getHistoricalData(symbol: string, timeframe: string = '1m'): Promise<OHLCVData[]> {
    console.log(`[CSVDataService] Fetching data for ${symbol} with timeframe ${timeframe}`);
    
    let data: OHLCVData[] = [];
    
    switch (symbol.toUpperCase()) {
      case 'BTCUSD':
      case 'BTC':
        data = this.btcData;
        break;
      case 'EURUSD':
      case 'EUR':
        data = this.eurData;
        break;
      default:
        // Default to BTC data
        data = this.btcData;
    }
    
    console.log(`[CSVDataService] Retrieved ${data.length} data points for ${symbol}`);
    console.log(`[CSVDataService] Sample data:`, {
      timestamp: data[0]?.timestamp,
      close: data[0]?.close,
      volume: data[0]?.volume
    });
    
    return data;
  }
}
