import '@/app/globals.css';

export const metadata = {
  title: 'Visio + Next.js + Payload',
  description: 'Generated by Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
