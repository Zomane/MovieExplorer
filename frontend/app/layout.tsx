import Providers from "@/providers/providers";
import "./globals.css"; 
import Navbar from "@/components/ui/Navbar";
import { Metadata } from "next";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: 'Movie Explorer',
  description: 'Каталог фильмов и коллекции зрителей'
}

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    // Dark Reader добавляет атрибуты на html до запуска React.
    <html lang="ru" suppressHydrationWarning>
      <body >
        <Providers>
          <header className="header"><Navbar/></header>
            <main className="main">
              {children}
            </main>
          <footer><Footer /></footer>
        </Providers>
      </body>
    </html>
  );
}
