import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Team',
};

export default function TeamPage() {
  return (
    <div>
      <h1>Team</h1>
      <ul>
        <li>
          <Link href="/team/ken">Ken</Link>
        </li>
        <li>
          <Link href="/team/lisa">Lisa</Link>
        </li>
      </ul>
    </div>
  );
}
