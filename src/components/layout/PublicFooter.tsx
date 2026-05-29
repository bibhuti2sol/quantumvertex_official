'use client';

import React from 'react';
import Link from 'next/link';

const PublicFooter = () => {
  return (
    <footer className="w-full bg-white border-t border-border py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">NextGenTask</span>
          <span className="text-xs text-muted-foreground border-l border-border pl-2">
            © 2026 All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
          <Link href="/product" className="hover:text-primary transition-colors">
            Product
          </Link>
          <Link href="/signup" className="hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/signup" className="hover:text-primary transition-colors">
            Support
          </Link>
        </div>

        <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
          Powered by <span className="text-primary/80">Quantum Vertex Solutions</span>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
