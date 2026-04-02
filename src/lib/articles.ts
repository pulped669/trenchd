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
  "Market",
  "DeFi",
  "NFTs",
  "Regulation",
  "Mining",
  "Altcoins",
  "Bitcoin",
  "Ethereum",
] as const;

export const ARTICLES: Article[] = [
  {
    slug: "solana-etf-filing",
    title: "Solana ETF Filing Sparks Institutional Interest — What It Means",
    excerpt:
      "The first Solana ETF application has been submitted to the SEC, signaling a major shift in institutional appetite for alt-L1s beyond Bitcoin and Ethereum.",
    category: "Market",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    date: "Apr 2, 2026",
    readTime: "4 min",
    featured: true,
  },
  {
    slug: "defi-lending-record",
    title: "DeFi Lending Hits $80B TVL — Aave and Morpho Lead the Charge",
    excerpt:
      "Total value locked in DeFi lending protocols has reached an all-time high, driven by institutional demand and real-world asset integrations.",
    category: "DeFi",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
    date: "Apr 2, 2026",
    readTime: "3 min",
    featured: true,
  },
  {
    slug: "bitcoin-mining-halving",
    title: "Post-Halving Mining Economics: Who Survives the Squeeze",
    excerpt:
      "With block rewards halved, miners are consolidating. Here's who's profitable and who's shutting down rigs.",
    category: "Mining",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80",
    date: "Apr 1, 2026",
    readTime: "5 min",
    featured: true,
  },
  {
    slug: "eu-crypto-regulation",
    title: "EU's MiCA Framework Goes Live — Full Breakdown of What Changed",
    excerpt:
      "The Markets in Crypto-Assets regulation is now enforceable across all member states. Exchanges, stablecoins, and DeFi protocols face new compliance requirements.",
    category: "Regulation",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    date: "Apr 1, 2026",
    readTime: "6 min",
  },
  {
    slug: "nft-gaming-surge",
    title: "On-Chain Gaming Sees 340% User Growth in Q1 2026",
    excerpt:
      "Web3 games are finally finding product-market fit. Daily active wallets across gaming protocols have surged past 2M.",
    category: "NFTs",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    date: "Mar 31, 2026",
    readTime: "3 min",
  },
  {
    slug: "ethereum-blob-upgrade",
    title: "Ethereum's Latest Upgrade Cuts L2 Fees by Another 60%",
    excerpt:
      "The Pectra upgrade's blob throughput increase is already showing results, with Base and Arbitrum transactions costing fractions of a cent.",
    category: "Ethereum",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    date: "Mar 31, 2026",
    readTime: "4 min",
  },
  {
    slug: "bitcoin-100k-resistance",
    title: "Bitcoin Tests $100K Again — Key Levels to Watch This Week",
    excerpt:
      "BTC is consolidating just below the psychological $100K mark. On-chain data suggests accumulation, but derivatives markets tell a different story.",
    category: "Bitcoin",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
    date: "Mar 30, 2026",
    readTime: "3 min",
  },
  {
    slug: "altcoin-season-signals",
    title: "Altcoin Season Index Hits 85 — Which Sectors Are Leading",
    excerpt:
      "Capital is rotating out of BTC and into alts. AI tokens, RWA protocols, and DePIN projects are outperforming across the board.",
    category: "Altcoins",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80",
    date: "Mar 30, 2026",
    readTime: "4 min",
  },
];
