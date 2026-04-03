export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  featured?: boolean;
  body?: string[];
  ca?: string;
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
    body: [
      "At 2:14 PM UTC on Tuesday, a token called $BARKX appeared on Pump.fun's new listings feed. Within 60 seconds it had 200 holders. Within five minutes, the market cap crossed $1M. By the 12-minute mark, it hit $4.2M — a 500x from launch price.",
      "Then the chart reversed. Hard.",
      "The creator wallet, which held 4.8% of supply, sold in a single transaction at the top. Three other wallets that had been accumulating in the first 90 seconds followed immediately. Within 20 minutes of launch, the market cap was back to $180K.",
      "This is a pattern we've seen dozens of times on Pump.fun over the past month. A coordinated group of wallets — often linked through shared SOL funding sources — enter in the first block, let retail FOMO do the work, then dump simultaneously.",
      "We traced the creator wallet back through five hops to a wallet that has deployed 14 other tokens in the past 30 days. Seven of them followed the exact same curve: rapid pump to $2-5M, coordinated dump, then slow bleed to zero.",
      "The question isn't whether this is happening — it clearly is. The question is whether Pump.fun's bonding curve mechanism makes it inevitable, or whether there are structural changes that could prevent it.",
      "For now, the meta is clear: if you're not in the first 30 seconds, you're probably exit liquidity.",
    ],
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
    body: [
      "A wallet ending in 7xKf that had been dormant since November 2025 suddenly started making large swaps on Jupiter on Monday morning. Over the next 48 hours, it accumulated roughly 102,000 SOL — worth approximately $18.2M at current prices.",
      "The buys were spread across multiple DEXs to minimize slippage. The wallet used Jupiter's DCA feature for about 60% of the volume, with the remaining 40% executed as limit orders on Raydium.",
      "On-chain analyst @zachxbt was the first to flag the wallet, noting that the funding source traces back to a Coinbase institutional custody address that has previously been linked to a mid-size crypto fund based in Singapore.",
      "This is notable because the same wallet pattern — dormancy followed by aggressive accumulation — preceded SOL's run from $80 to $150 in Q4 2025. The fund appears to make concentrated bets and hold for 60-90 day periods.",
      "The wallet has not made any other token purchases. It's purely SOL accumulation, suggesting a directional bet on Solana rather than a DeFi farming strategy.",
      "At press time, the wallet holds 102,400 SOL and has not made any further transactions since Wednesday morning.",
    ],
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
    body: [
      "At 11:47 PM EST on Monday, Elon Musk posted a photo of his Shiba Inu, Floki, sitting on what appeared to be a Tesla Model S dashboard. The caption: a single dog emoji.",
      "Within three minutes, DOGE was up 18%. The move happened so fast that most of the price action was contained in a single one-minute candle on Binance.",
      "Derivatives data from Coinglass shows $42M in DOGE short positions were liquidated in that window. The largest single liquidation was a $2.8M short on OKX.",
      "This is the seventh time in 2026 that an Elon tweet has moved DOGE more than 10%. Traders have built entire strategies around monitoring his posting patterns — and the data shows his tweets between 10 PM and midnight EST tend to have the largest market impact.",
      "DOGE has since retraced about half the move, currently trading at $0.189, still up 9% from pre-tweet levels.",
    ],
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
    body: [
      "If you've been launching cat-themed tokens on Pump.fun this week, you've probably noticed something: they're not hitting anymore. The bonding curve fills are taking longer, the graduation rate has dropped, and the post-graduation pumps are smaller.",
      "Meanwhile, a new meta is emerging. Tokens themed around AI agents, autonomous trading bots, and 'sentient' meme coins are consistently outperforming everything else on the platform.",
      "The data backs this up. Of the 47 tokens that graduated from Pump.fun's bonding curve in the last 7 days, 18 had AI or agent-related branding. Only 3 were cat-themed, down from 12 the week before.",
      "The top performer was $AGENTX, which graduated and hit a $12M market cap within 4 hours. The token's gimmick: a Twitter bot that 'autonomously' trades memecoins and posts its P&L. Whether the bot actually works is debatable, but the narrative was enough.",
      "For degens tracking the meta, the signal is clear: the market wants tokens with a story that feels like it could be real. Pure animal themes are saturated. Anything with a tech angle — especially AI — has a higher probability of catching a bid.",
    ],
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
    body: [
      "We've been tracking a cluster of 23 wallets that have historically front-run major memecoin moves. These wallets were early to $WIF, early to $BONK's second leg, and early to the $POPCAT run in late 2025.",
      "Over the past two weeks, 19 of the 23 wallets have started accumulating positions in tokens with market caps under $1M. The average position size is small — $8K to $25K per token — but the breadth is notable. These wallets are placing bets across 40+ tokens.",
      "The most commonly held token among the group is $RINT, an AI-themed memecoin currently at a $640K market cap. Fourteen of the 23 wallets hold it.",
      "Other names appearing across multiple wallets: $BOOP ($380K MC), $SOLDOG ($220K MC), and $AGNT ($890K MC).",
      "None of this is financial advice. These wallets could be wrong. But their historical hit rate of catching at least one 10x+ in each rotation cycle is hard to ignore.",
      "We'll be publishing a follow-up in one week tracking which of these positions performed.",
    ],
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
    body: [
      "At 11:22 PM EST on Sunday, Donald Trump posted on Truth Social: 'I love crypto and always have. The United States will be the crypto capital of the world. Watch!'",
      "Total crypto market cap added $80B in the following four hours. Bitcoin moved from $96,800 to $99,200. Ethereum jumped 4.2%. But the real action was in memecoins.",
      "$TRUMP, the largest Trump-branded token on Solana, went from $0.42 to $1.18 — a 180% move. $MAGA pumped 90%. Even $BODEN, a Biden-themed token, caught a 40% bid on the chaos.",
      "This is the third time a Trump social media post has added more than $50B to the crypto market cap. The correlation is now so reliable that at least two hedge funds are known to run sentiment scrapers on Truth Social.",
      "Whether this translates to actual policy remains to be seen. But the market clearly trades the headline first and asks questions later.",
    ],
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
    body: [
      "The battle for Solana's top memecoin is getting interesting again. After months of WIF dominance, BONK is making moves that could shift the dynamic.",
      "BONK's team announced a new burn mechanism that destroys 1% of all DEX trading volume. Since the announcement three days ago, 2.1 billion BONK tokens have been burned — roughly $840K worth at current prices.",
      "Meanwhile, WIF secured its fourth major CEX listing this quarter, going live on Kraken on Monday. The listing was accompanied by a 12% price jump, though it's since given back about half of that.",
      "In terms of market cap, WIF still leads at $1.8B vs BONK's $1.2B. But BONK's daily trading volume has actually surpassed WIF's for the first time since January.",
      "The community dynamics are also shifting. BONK's Discord has grown by 40K members this month, while WIF's has been relatively flat. Both communities are fiercely loyal and not shy about dunking on each other on Twitter.",
      "For traders, the play here might be the pair trade rather than picking a side. When one pumps, the other tends to follow within 24-48 hours.",
    ],
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
    body: [
      "A crypto Twitter influencer with over 400,000 followers — who we're choosing not to name until they respond to our request for comment — was caught this week deploying, promoting, and dumping their own token in under six hours.",
      "Here's the timeline, reconstructed entirely from on-chain data:",
      "9:14 AM: A wallet funded by a Binance withdrawal linked to the influencer deploys a token on Pump.fun. 9:18 AM: The influencer tweets 'just found something interesting, not gonna say what 👀'. 9:22 AM: A second tweet: 'ok fine, $[TOKEN] looks like it could be the next $WIF.' 9:45 AM: Token graduates from Pump.fun bonding curve. Market cap hits $2.1M.",
      "12:30 PM: Market cap reaches $4.8M. The influencer posts a thread about why the token's 'community is built different.' 3:02 PM: The deployer wallet and four connected wallets sell their entire positions in a coordinated dump. Market cap drops to $600K in 15 minutes.",
      "3:15 PM: The influencer deletes all tweets about the token.",
      "On-chain investigators @zachxbt and @lookonchain independently verified the wallet connections. The deployer wallet received its initial SOL from the same Binance account that previously funded the influencer's known NFT trading wallet.",
      "This is the third high-profile influencer rug on Solana this month. The lack of accountability on crypto Twitter remains one of the biggest risks for retail traders in the memecoin space.",
    ],
  },
];
