export interface Stock {
  id: string;
  symbol: string;
  company_name: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  user_id: string;
  created_at: string;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalGainLoss: number;
  topPerformer: Stock | null;
  worstPerformer: Stock | null;
}