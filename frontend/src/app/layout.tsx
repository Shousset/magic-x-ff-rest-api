import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Magic: The Gathering — Catálogo & Colecciones',
  description:
    'Catálogo de cartas y colecciones personales de Final Fantasy y The Hobbit.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
