import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-md bg-black/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/jobs"
          className="flex items-center gap-2 text-orange-400 font-bold text-lg tracking-tight hover:text-orange-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
        >
          <Zap size={20} className="fill-orange-400" />
          Remotown GmbH
        </Link>
        <span className="text-xs text-white/50 font-medium uppercase tracking-widest">
          Phone Screening Platform
        </span>
      </div>
    </header>
  );
}
