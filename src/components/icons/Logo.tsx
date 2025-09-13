import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15.5 2.5a1.5 1.5 0 0 0-3 0V11a1.5 1.5 0 0 0 3 0V2.5z" />
      <path d="M8.5 2.5a1.5 1.5 0 0 0-3 0V11a1.5 1.5 0 0 0 3 0V2.5z" />
      <path d="M4 11h16" />
      <path d="M4.5 11.5a2.5 2.5 0 0 1-2.4-3.2A2.5 2.5 0 0 1 4.4 6H19.6a2.5 2.5 0 0 1 2.3 2.3 2.5 2.5 0 0 1-2.4 3.2" />
      <path d="M6 18a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2H6v-2z" />
    </svg>
  );
}
