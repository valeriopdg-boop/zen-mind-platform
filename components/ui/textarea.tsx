'use client';

import * as React from 'react';

export function Textarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  const base =
    'w-full px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-white text-sm resize-none';
  return <textarea className={`${base} ${className}`} {...props} />;
}
