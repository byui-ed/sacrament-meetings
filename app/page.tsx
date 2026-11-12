import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 py-12 text-center">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-2">
          <Image
            className="dark:invert h-5 w-[100px]"
            src="/tailwind-practice.png"
            alt="Colorful abstract shapes representing web design"
            width={650}
            height={400}
            priority
          />
          <Image
            className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 py-12 text-center"
            src="/tailwind_practice.png"
            alt="Colorful abstract shapes representing web design"
            width={650}
            height={400}
          />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Sacrament Meeting Planner
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          Designed for bishoprics and branch leaders to plan, review, and organize sacrament meeting agendas. Easily manage hymns, speakers, ward business, and announcements, while allowing members to view and print programs for current and past weeks.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link
            href="/meetings/current"
            className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            View Current Program
          </Link>
          <Link
            href="/meetings"
            className="bg-gray-100 text-gray-800 font-medium px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
          >
            Browse All Meetings
          </Link>
        </div>
      </div>
    </main>
  );
}