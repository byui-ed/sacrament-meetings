import NavLinks from './NavLinks';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg tracking-tight">Riverside Ward</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{currentDate}</p>
        </div>
        <NavLinks />
      </div>
    </header>
  );
}