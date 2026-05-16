import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Remotown — Phone Screening Platform',
  description: 'Structured phone screening for modern recruitment teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
