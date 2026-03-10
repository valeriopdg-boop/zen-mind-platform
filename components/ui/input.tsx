'use client';

import * as React from 'react';

export function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  const base =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent bg-white text-sm';
  return <input className={`${base} ${className}`} {...props} />;
}

