export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export const CATEGORIES = [
  "All",
  "Solana",
  "Bankr",
  "Blue Chips",
  "X",
] as const;

export const ARTICLES: Article[] = [
  {
    slug: "pump-fun-token-500x",
    title: "Pump.fun Token Hits 500x in 12 Minutes — Inside the Launch",
    excerpt:
      "A dog-themed token launched on Pump.fun hit a $4.2M market cap in under 15 minutes before retracing. Here's what the on-chain data shows about who got in early and who got left holding.",
    category: "Solana",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    date: "Apr 2, 2026",
    readTime: "3 min",
    featured: true,
  },
  {
    slug: "bankr-app-50k-users",
    title: "Bankr Crosses 50K Users as Crypto Banking Goes Mainstream",
    excerpt:
      "The Bankr app just hit 50,000 active wallets. Its instant on-ramp and spending card are pulling in users who've never touched DeFi before.",
    category: "Bankr",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
    date: "Apr 2, 2026",
    readTime: "4 min",
    featured: true,
  },
  {
    slug: "elon-doge-tweet-pump",
    title: "Elon Posts a Shiba Pic — DOGE Pumps 18% in One Candle",
    excerpt:
      "A single tweet from Elon Musk featuring his Shiba Inu sent Dogecoin up 18% in minutes. Derivatives data shows $42M in shorts got liquidated.",
    category: "X",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80",
    date: "Apr 1, 2026",
    readTime: "2 min",
    featured: true,
  },
  {
    slug: "solana-meme-coin-meta",
    title: "The Solana Meme Coin Meta Is Shifting — What's Working Now",
    excerpt:
      "Cat coins are out, AI agent tokens are in. The latest Pump.fun trends show a clear rotation in what communities are aping into and what's dying on launch.",
    category: "Solana",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80",
    date: "Apr 1, 2026",
    readTime: "5 min",
  },
  {
    slug: "bitcoin-etf-inflows-record",
    title: "Bitcoin ETFs See $1.2B Inflow Day — Largest Since January",
    excerpt:
      "Institutional appetite for BTC isn't slowing down. BlackRock's IBIT alone pulled in $680M in a single session as Bitcoin holds above $97K.",
    category: "Blue Chips",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
    date: "Mar 31, 2026",
    readTime: "3 min",
  },
  {
    slug: "bankr-debit-card-launch",
    title: "Bankr Launches Crypto Debit Card With Zero Fees on SOL Spending",
    excerpt:
      "Bankr's new Visa card lets users spend SOL and USDC anywhere with no conversion fees. The card auto-converts at the point of sale with no spread.",
    category: "Bankr",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    date: "Mar 31, 2026",
    readTime: "4 min",
  },
  {
    slug: "trump-crypto-tweet-chaos",
    title: "Trump Posts 'I Love Crypto' — Market Rips $80B in Market Cap",
    excerpt:
      "A late-night Truth Social post from Donald Trump saying he 'loves crypto and always has' sent the total market cap surging. Meme coins tied to his name went parabolic.",
    category: "X",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    date: "Mar 30, 2026",
    readTime: "3 min",
  },
  {
    slug: "eth-sol-flippening",
    title: "SOL Flips ETH in Daily DEX Volume for the Third Week Straight",
    excerpt:
      "Solana is now consistently processing more DEX volume than Ethereum mainnet. Jupiter alone is doing more daily volume than Uniswap across all chains.",
    category: "Blue Chips",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    date: "Mar 30, 2026",
    readTime: "4 min",
  },
];
