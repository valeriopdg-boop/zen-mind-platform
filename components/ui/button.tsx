'use client';

export function Button({
  variant = 'default',
  className = '',
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'destructive';
}) {
  const base =
    'px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    default: 'bg-[#14B8A6] text-white hover:bg-[#0F766E]',
    outline: 'border-2 border-[#14B8A6] text-[#0F766E] hover:bg-[#14B8A6]/10',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

