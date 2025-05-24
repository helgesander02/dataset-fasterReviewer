import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import LeftSidebar from '@/components/HomeLeftSidebar';
import RightSidebar from '@/components/HomeRightSidebar';
import { JobDatasetProvider } from '@/components/JobDatasetContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dataset Faster Reviewer',
  description: 'A tool to quickly review datasets and jobs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JobDatasetProvider>
          <main className="flex h-screen">
            {/* Left - Selection */}
            <LeftSidebar />

            {/* Middle - Image Grid */}
            <div className="flex-1">{children}</div>

            {/* Right - Record */}
            <RightSidebar />
          </main>
        </JobDatasetProvider>
      </body>
    </html>
  );
}