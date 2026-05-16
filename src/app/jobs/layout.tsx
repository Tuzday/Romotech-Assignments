import { Navbar } from '@/components/layout/Navbar';
import { ReactNode } from 'react';

export default function RecruiterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </>
  );
}
