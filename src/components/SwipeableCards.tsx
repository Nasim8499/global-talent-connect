import { useRef, type ReactNode } from 'react';

interface SwipeableCardsProps {
  children: ReactNode;
  className?: string;
}

export default function SwipeableCards({ children, className = '' }: SwipeableCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className={`flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide touch-pan-x ${className}`}
        style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {children}
      </div>
      <div className="md:hidden pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export function SwipeCard({ children, className = '', minWidth = '260px' }: { children: ReactNode; className?: string; minWidth?: string }) {
  return (
    <div
      className={`flex-shrink-0 snap-start ${className}`}
      style={{ minWidth }}
    >
      {children}
    </div>
  );
}
