import Providers from "@/providers/providers";
import "./globals.css"; 
import Navbar from "@/components/ui/Navbar";
import { Metadata } from "next";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: 'Movie Explorer',
  description: 'Каталог фильмов и пользователей'
}

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
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
