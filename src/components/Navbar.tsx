import Link from "next/link";

const NAV_LINKS = [
  { label: "Memecoins", href: "/?cat=Memecoins" },
  { label: "X", href: "/?cat=X" },
  { label: "On-Chain", href: "/?cat=On-Chain" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-2xl backdrop-saturate-[1.8]">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group">
            <span className="font-editorial text-[22px] font-bold text-fg transition-colors group-hover:text-accent">
              trenchd
            </span>
          </Link>
          <nav className="hidden items-center gap-1.5 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-[14px] font-medium text-white transition-all duration-200 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="h-px bg-border" />
      </div>
    </header>
  );
}
