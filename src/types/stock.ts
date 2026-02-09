export type QuoteRespose = {
  results: {
    symbol: string
    longName: string
    regularMarketPrice: number
    regularMarketTime: string
    logourl: string
    historicalDataPrice: {
      close: number
      date: number
    }[]
  }[]
}

export type StockListResponse = {
  stocks: {
    stock: string
    sector: string
    type: string
  }[]
  availableStockTypes: string[]
}
