'use client';

import { useToggle } from '@/hooks/useToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { CgCloseO, CgMenuRound } from 'react-icons/cg';

/* 
Barrierefreies Menü:
https://inclusive-components.design/menus-menu-buttons/
*/

/* Hier noch den Typ LinkTarget mit Eigenschaften text und url
erstellen und sicherstellen, dass die Objekte in linkTargets 
diesem Typ entsprechen. */

type LinkTarget = {
  text: string;
  url: string;
};

const linkTargets = [
  {
    text: 'Startseite',
    url: '/',
  },
  { text: 'Unser Team', url: '/team' },
  { text: 'Client & Server', url: '/client-server' },
  { text: 'Shop', url: '/shop' },
  { text: 'Standorte', url: '/standorte' },
  { text: 'Bilder', url: '/bilder' },
  { text: 'Blog', url: '/blog' },
  { text: 'GQL-Blog', url: '/gql-blog' },
  { text: 'Petition', url: '/petition' },
] satisfies LinkTarget[];

export default function MainNavigation() {
  const [isOpen, toggleMenu, , , closeMenu] = useToggle(false);

  const pathname = usePathname();

  /* Wenn pathname sich ändert, soll das Menü geschlossen werden. */
  useEffect(() => closeMenu(), [pathname, closeMenu]);

  return (
    <nav className="main-navigation">
      <button
        className="main-navigation__button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Hauptmenü"
      >
        Menü {isOpen ? <CgCloseO /> : <CgMenuRound />}
      </button>
      {isOpen && (
        <ul className="main-navigation__list">
          {getMenuItems(linkTargets, pathname)}
        </ul>
      )}
    </nav>
  );
}

function getMenuItems(linkTargets: LinkTarget[], pathname: string) {
  {
    /*         <li>
            <Link href="/team">Team</Link>
          </li> */
  }

  /* Alle Link-Elemente sollen die CSS-Klasse main-navigation__link
    erhalten, zusätzlich soll das Link-Element, das der aktuell angezeigten
    Seite entspricht, die Klasse main-navigation__link--current erhalten */

  return linkTargets.map(({ text, url }) => {
    const isCurrentPage = url === pathname;

    /* Etwas komplizierter Ansatz, um ein Attribut gar nicht oder mit
		einem bestimmten Wert in ein Element zu geben, ohne TS-Fehler oder
		ungültiges HTML zu erzeugen. (Bei vielen Attributen kann man false als
		Wert setzen, React lässt das Attribut dann weg, aber bei aria-current
		ist false ein gültiger Wert.)
		Der der aktuellen Seite entsprechend Link soll das attribut aria-current="page"
		haben, alle anderen Links sollen das Attribut gar nicht haben.
		https://tink.uk/using-the-aria-current-attribute/  */
    const attributes = isCurrentPage
      ? ({ 'aria-current': 'page' } as const)
      : {};

    const cssClasses = `main-navigation__link ${
      isCurrentPage ? 'main-navigation__link--current' : ''
    }`;

    return (
      <li key={url}>
        <Link className={cssClasses} href={url} {...attributes}>
          {text}
        </Link>
      </li>
    );
  });
}
