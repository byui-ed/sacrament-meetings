export default function MeetingsLoading() {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-pulse">
      {[1, 2, 4].map((i) => (
        <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      ))}
    </div>
  );
}