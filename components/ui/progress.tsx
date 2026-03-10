'use client';

export function Progress({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={`w-full overflow-hidden rounded-full ${className}`}>
      <div
        className="h-full bg-[#14B8A6] transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
