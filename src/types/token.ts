export interface Token {
  mint: string;
  name: string;
  ticker: string;
  description: string;
  image: string;
  creator: string;
  createdAt: number;
  marketCap: number;
  price: number;
  supply: number;
  sold: number;
  graduated: boolean;
}

export interface Trade {
  id: string;
  mint: string;
  trader: string;
  type: "buy" | "sell";
  amount: number;
  solAmount: number;
  price: number;
  timestamp: number;
}
