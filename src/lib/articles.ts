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
  "Memecoins",
  "X",
  "On-Chain",
] as const;

export const ARTICLES: Article[] = [
  {
    slug: "pump-fun-token-500x",
    title: "Pump.fun Token Hits 500x in 12 Minutes — Inside the Launch",
    excerpt:
      "A dog-themed token launched on Pump.fun hit a $4.2M market cap in under 15 minutes before retracing. Here's what the on-chain data shows about who got in early and who got left holding.",
    category: "Memecoins",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    date: "Apr 2, 2026",
    readTime: "3 min",
    featured: true,
  },
  {
    slug: "whale-wallet-accumulating-sol",
    title: "Whale Wallet Accumulates $18M in SOL Over 48 Hours",
    excerpt:
      "A previously dormant wallet woke up and started buying SOL aggressively across Jupiter and Raydium. On-chain sleuths traced it back to a known fund.",
    category: "On-Chain",
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
    category: "Memecoins",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80",
    date: "Apr 1, 2026",
    readTime: "5 min",
  },
  {
    slug: "smart-money-rotating-into-memes",
    title: "Smart Money Is Rotating Into Memecoins — On-Chain Proof",
    excerpt:
      "Wallets that called the last 3 major runs are all loading up on sub-$1M cap tokens. We tracked the exact wallets and what they're buying.",
    category: "On-Chain",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
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
    date: "Mar 31, 2026",
    readTime: "3 min",
  },
  {
    slug: "bonk-vs-wif-rivalry",
    title: "BONK vs WIF: The Solana Memecoin Rivalry Heating Up Again",
    excerpt:
      "Both tokens are fighting for the #1 Solana meme spot. BONK just announced a burn mechanism while WIF is getting listed on another CEX.",
    category: "Memecoins",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    date: "Mar 30, 2026",
    readTime: "3 min",
  },
  {
    slug: "crypto-twitter-influencer-rug",
    title: "CT Influencer With 400K Followers Caught Rugging His Own Token",
    excerpt:
      "On-chain evidence shows a well-known crypto Twitter personality deployed, promoted, and dumped a token within 6 hours. Community tracked every wallet.",
    category: "X",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    date: "Mar 30, 2026",
    readTime: "5 min",
  },
];
