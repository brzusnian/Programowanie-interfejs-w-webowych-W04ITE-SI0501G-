import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Gierkownia</h1>
      <p>Poznaj świetne gry planszowe, karciane i nie tylko!</p>
      <Link href="/games">Poznaj nasze oferty</Link>
    </div>
  );
}