import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Board Games Market",
  description: "Marketplace gier planszowych",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <nav className="navbar">
          <Link href="/">Home</Link>
          <Link href="/games">Games</Link>
          <Link href="/games/new">Add game</Link>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}