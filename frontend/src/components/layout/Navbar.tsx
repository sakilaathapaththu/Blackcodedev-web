'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { mainNav } from '@/config/site';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import logo from '@/assets/images/logo.png';
import './navbar.css';

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(100);
  // Remember which page the menu was opened on, so it closes automatically
  // after navigating without needing an effect.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const menuOpen = menuOpenOn === pathname;

  const links = mainNav.filter((link) => !link.onlyOn || link.onlyOn === pathname);

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : undefined}>
      <div className="nav-container">
        <Link href="/" className="logo">
          <Image src={logo} alt="BlackCode Devs Logo" priority sizes="200px" />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul id="primary-navigation" className={menuOpen ? 'nav-links show' : 'nav-links'}>
          {links.map((link) => {
            const active = link.href === pathname;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={active ? 'active' : undefined}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMenuOpenOn(null)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
