import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'SADGYANAM — Premier Digital Coaching Platform | Classes 6th to 10th',
  description:
    'Experience True Knowledge with SADGYANAM Coaching Center. Specialized academic coaching for Class 6th to Class 10th CBSE/ICSE Board exams, NTSE, Science & Maths Olympiads, and Foundation JEE/NEET.',
  keywords: [
    'SADGYANAM',
    'Coaching Center',
    'Class 10 CBSE Board',
    'Class 9 Coaching',
    'Class 8 Foundation',
    'Class 7 Olympiad',
    'Class 6 Coaching',
    'NTSE',
    'Olympiad Prep',
    'EdTech',
  ],
  icons: {
    icon: '/branding/sadgyanam-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 overflow-x-hidden max-w-full">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
