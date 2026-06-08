import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  label: string;
  icon?: React.ReactNode;
}

export function FilterPill({ active = false, label, icon, className, ...props }: FilterPillProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300",
        "border shadow-sm hover:shadow-md",
        active 
          ? "bg-sierra-estatese text-white border-sierra-estatese" 
          : "bg-white text-sierra-navy border-sierra-navy/10 hover:border-sierra-navy/30 hover:bg-sierra-ivory",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}
