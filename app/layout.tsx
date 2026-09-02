import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StateProvider } from '@/context/StateContext';
import DashboardLayout from '@/components/DashboardLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hem Sanchar | Disaster Management Division, Ministry of Home Affairs',
  description: 'National Disaster Management Division tactical operations dashboard with real-time hydrological telemetry from Supabase and Google Gemini AI evacuation briefing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F5F5F7] text-[#1D1D1F]">
        <StateProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </StateProvider>
      </body>
    </html>
  );
}
