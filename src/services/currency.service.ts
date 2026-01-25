import { fetchMajorCurrencies } from '../providers/currency.provider'

const currencyCodeMap = {
  USD: 'Dólar',
  EUR: 'Euro',
  JPY: 'Iene',
  GBP: 'Libra Esterlina',
}

function calculateMidMarketPrice(bid: string, ask: string) {
  const mid = (Number(bid) + Number(ask)) / 2
  return mid.toFixed(2)
}

export async function getMidMarketCurrencyRates() {
  const currencies = await fetchMajorCurrencies()
  return currencies.map((c) => ({
    code: c.code,
    name: currencyCodeMap[c.code],
    rate: calculateMidMarketPrice(c.bid, c.ask),
    pctChange: Number(c.pctChange).toFixed(3),
  }))
}
