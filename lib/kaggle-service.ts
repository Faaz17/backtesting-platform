// Kaggle API will be imported dynamically on server side only

export interface OHLCVData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface KaggleConfig {
  username: string;
  key: string;
}

export class KaggleDataService {
  private api: KaggleApi;
  private config: KaggleConfig;

  // Verified dataset mappings
  private readonly VERIFIED_DATASETS = {
    'EURUSD': {
      owner: 'jkalamar',
      dataset: 'eurusd-foreign-exchange-fx-intraday-1minute',
      url: 'https://www.kaggle.com/datasets/jkalamar/eurusd-foreign-exchange-fx-intraday-1minute'
    },
    'XAUUSD': {
      owner: 'yosepkrisna',
      dataset: 'xauusd-1-minute-dataset',
      url: 'https://www.kaggle.com/datasets/yosepkrisna/xauusd-1-minute-dataset'
    },
    'BTCUSD': {
      owner: 'imranbukhari',
      dataset: 'comprehensive-btcusd-1m-data',
      url: 'https://www.kaggle.com/datasets/imranbukhari/comprehensive-btcusd-1m-data'
    },
    'BTC': {
      owner: 'imranbukhari',
      dataset: 'comprehensive-btcusd-1m-data',
      url: 'https://www.kaggle.com/datasets/imranbukhari/comprehensive-btcusd-1m-data'
    }
  };

  constructor(config: KaggleConfig) {
    this.config = config;
    this.api = new KaggleApi();
    this.api.authenticate({
      username: config.username,
      key: config.key
    });
  }

  async getHistoricalData(symbol: string, timeframe: string = '1m'): Promise<OHLCVData[]> {
    try {
      // Normalize symbol to uppercase for mapping
      const normalizedSymbol = symbol.toUpperCase();
      
      // Check if we have a verified dataset for this symbol
      const datasetInfo = this.VERIFIED_DATASETS[normalizedSymbol];
      
      if (!datasetInfo) {
        throw new Error(`No verified dataset available for symbol: ${symbol}. Available symbols: ${Object.keys(this.VERIFIED_DATASETS).join(', ')}`);
      }

      console.log(`[Kaggle] Fetching data from verified dataset: ${datasetInfo.url}`);

      // Get dataset files
      const datasetFiles = await this.api.datasets.listFiles({
        owner: datasetInfo.owner,
        dataset: datasetInfo.dataset
      });

      if (!datasetFiles || datasetFiles.length === 0) {
        throw new Error(`No files found in dataset: ${datasetInfo.dataset}`);
      }

      // Find the most relevant CSV file
      const csvFiles = datasetFiles.filter(file => 
        file.name.toLowerCase().includes('.csv')
      );

      if (csvFiles.length === 0) {
        throw new Error(`No CSV files found in dataset: ${datasetInfo.dataset}`);
      }

      // Use the first CSV file (or find the most relevant one)
      const csvFile = this.findBestCSVFile(csvFiles, normalizedSymbol);
      
      console.log(`[Kaggle] Downloading file: ${csvFile.name} from ${datasetInfo.dataset}`);

      // Download the CSV file
      const csvData = await this.api.datasets.download({
        owner: datasetInfo.owner,
        dataset: datasetInfo.dataset,
        file: csvFile.name
      });

      // Parse CSV data and convert to OHLCV format
      const ohlcvData = this.parseCSVToOHLCV(csvData, normalizedSymbol);
      
      console.log(`[Kaggle] Successfully parsed ${ohlcvData.length} data points for ${normalizedSymbol}`);
      
      return ohlcvData;
    } catch (error) {
      console.error('Error fetching data from Kaggle:', error);
      throw error;
    }
  }

  private findBestCSVFile(csvFiles: any[], symbol: string): any {
    // Try to find the most relevant file based on name
    const symbolLower = symbol.toLowerCase();
    
    // Look for files that contain the symbol name
    const symbolFiles = csvFiles.filter(file => 
      file.name.toLowerCase().includes(symbolLower)
    );
    
    if (symbolFiles.length > 0) {
      return symbolFiles[0];
    }
    
    // Look for files with common names
    const commonNames = ['data', 'price', 'ohlc', 'tick', '1m', '1min'];
    for (const name of commonNames) {
      const matchingFiles = csvFiles.filter(file => 
        file.name.toLowerCase().includes(name)
      );
      if (matchingFiles.length > 0) {
        return matchingFiles[0];
      }
    }
    
    // Return the first CSV file as fallback
    return csvFiles[0];
  }

  private parseCSVToOHLCV(csvData: string, symbol: string): OHLCVData[] {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Find column indices
    const timestampIndex = this.findColumnIndex(headers, ['timestamp', 'date', 'time', 'datetime']);
    const openIndex = this.findColumnIndex(headers, ['open', 'o']);
    const highIndex = this.findColumnIndex(headers, ['high', 'h']);
    const lowIndex = this.findColumnIndex(headers, ['low', 'l']);
    const closeIndex = this.findColumnIndex(headers, ['close', 'c', 'price']);
    const volumeIndex = this.findColumnIndex(headers, ['volume', 'vol', 'v']);

    if (timestampIndex === -1 || closeIndex === -1) {
      throw new Error('Required columns (timestamp, close) not found in dataset');
    }

    const ohlcvData: OHLCVData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < Math.max(timestampIndex, openIndex, highIndex, lowIndex, closeIndex, volumeIndex) + 1) {
        continue;
      }

      try {
        const timestamp = values[timestampIndex].trim();
        const open = openIndex !== -1 ? parseFloat(values[openIndex]) : parseFloat(values[closeIndex]);
        const high = highIndex !== -1 ? parseFloat(values[highIndex]) : parseFloat(values[closeIndex]);
        const low = lowIndex !== -1 ? parseFloat(values[lowIndex]) : parseFloat(values[closeIndex]);
        const close = parseFloat(values[closeIndex]);
        const volume = volumeIndex !== -1 ? parseFloat(values[volumeIndex]) : 0;

        if (!isNaN(close)) {
          ohlcvData.push({
            timestamp,
            open: isNaN(open) ? close : open,
            high: isNaN(high) ? close : high,
            low: isNaN(low) ? close : low,
            close,
            volume: isNaN(volume) ? 0 : volume
          });
        }
      } catch (error) {
        console.warn(`Error parsing line ${i}:`, error);
        continue;
      }
    }

    // Sort by timestamp and get last year of data
    ohlcvData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return ohlcvData.filter(data => new Date(data.timestamp) >= oneYearAgo);
  }

  private findColumnIndex(headers: string[], possibleNames: string[]): number {
    for (const name of possibleNames) {
      const index = headers.findIndex(header => header.includes(name));
      if (index !== -1) return index;
    }
    return -1;
  }

  // Alternative method to get data from popular financial datasets
  async getPopularFinancialData(symbol: string): Promise<OHLCVData[]> {
    const popularDatasets = [
      'prasoonkottarathil/btc-historical-data',
      'jessevent/all-crypto-currencies',
      'sudalairajkumar/cryptocurrencypricehistory',
      'tusharagrawal/bitcoin-historical-data',
      'prasoonkottarathil/stock-market-data'
    ];

    for (const datasetRef of popularDatasets) {
      try {
        const [owner, dataset] = datasetRef.split('/');
        const files = await this.api.datasets.listFiles({ owner, dataset });
        
        const csvFiles = files.filter(file => 
          file.name.toLowerCase().includes('.csv') &&
          (file.name.toLowerCase().includes(symbol.toLowerCase()) ||
           file.name.toLowerCase().includes('btc') ||
           file.name.toLowerCase().includes('bitcoin'))
        );

        if (csvFiles.length > 0) {
          const csvData = await this.api.datasets.download({ owner, dataset, file: csvFiles[0].name });
          return this.parseCSVToOHLCV(csvData, symbol);
        }
      } catch (error) {
        console.warn(`Failed to get data from ${datasetRef}:`, error);
        continue;
      }
    }

    throw new Error(`No data found for symbol: ${symbol}`);
  }
}
