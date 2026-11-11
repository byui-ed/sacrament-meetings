'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/meetings', label: 'Meetings' },
    { href: '/meetings/current', label: 'Current Sunday' },
  ];

  return (
    <nav aria-label="Primary" className="flex items-center gap-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/meetings' && pathname.startsWith('/meetings') && pathname !== '/meetings/current');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors font-medium text-sm ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400 pb-1'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}