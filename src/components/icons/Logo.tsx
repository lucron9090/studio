import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      {...props}
    >
      <path d="M2 5L8 5L8 8L2 8L2 5Z" />
      <path d="M10 5L16 5L16 8L10 8L10 5Z" />
      <path d="M18 5L24 5" />
      <path d="M2 11L8 11" />
      <path d="M2 17L8 17L8 20L2 20L2 17Z" />
      <path d="M10 17L16 17L16 20L10 20L10 17Z" />
      <path d="M18 11L24 11" />
      <path d="M18 17L24 17" />
    </svg>
  );
}
