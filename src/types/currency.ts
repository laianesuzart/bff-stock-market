export type MajorCurrency = 'USD' | 'EUR' | 'JPY' | 'GBP'

export type CurrencyResponse<T> = {
  [key: string]: {
    code: T
    bid: string
    ask: string
    pctChange: string
  }
}
