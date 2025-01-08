import PendingSignatures from '@/components/Petition/PendingSignatures';
import saveTheWhales from '@/img/save-the-whales.jpg';
import prisma from '@/prisma/db';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

/* Pages erhalten automatisch ein Objekt searchParams als Prop */
type Props = {
  searchParams: {
    page: string;
    perPage: string;
  };
};

const defaultPerPage = 1;

export const metadata: Metadata = {
  title: '🐳 Rettet die Wale - Jetzt unterschreiben!',
};

export default async function PetitionPage({ searchParams }: Props) {
  /* Setzt eine Pagination um. Standardmäßig sollen z.B. nur die ersten 2
	Unterschriften angezeigt werden. Aber über den Search-Parameter page
	soll die Seite konfigurierbar sein, mit dem Parameter perPage soll man
	angeben können, dass mehr Unterschriften pro Seite sichtbar sind.
	Versucht möglichst, ungültige oder extreme Werte für page und perPage
	zu vermeiden. 
	*/

  const { page, perPage } = await searchParams;

  const perPageNumber = Math.max(
    Math.min(parseInt(perPage) || defaultPerPage, 100),
    1
  );

  /* Nutzt die Methode count von prisma, um die Anzahl der approved
	Unterschriften in die Variable totalSignatures zu speichern. */
  const totalSignatures = await prisma.signature.count({
    where: {
      approved: true,
    },
  });

  const totalPageCount = Math.ceil(totalSignatures / perPageNumber);

  let pageNumber = Math.max(parseInt(page) || 1, 1);
  if (pageNumber > totalPageCount) {
    pageNumber = 1;
  }

  /* Die Ergebnisse sollen in anderer Reihenfolge aus der Datenbank kommen, älteste
Unterschriften zuerst. Zuerst alle genehmigten Unterschriften anzeigen, danach
die Argumente für Pagination ergänzen. */
  const signatures = await prisma.signature.findMany({
    where: {
      approved: true,
    },
    orderBy: {
      date: 'asc',
    },
    take: perPageNumber,
    skip: (pageNumber - 1) * perPageNumber,
  });

  const perPageParam =
    perPageNumber !== defaultPerPage ? `&perPage=${perPageNumber}` : '';

  return (
    <>
      <h1 className="petition__heading">Rettet die Wale!</h1>

      {/* Das Bild mit Hilfe der Next Image-Komponente hier erstellen, mit den korrekten
Attributen, z.B. korrekte sizes-Angabe. Klassenname ist petition__image */}
      <Image
        src={saveTheWhales}
        alt="Save the Whales von Friedensreich Hundertwasser"
        className="petition__image"
        sizes="(width < 32rem) 90vw, 30rem"
        placeholder="blur"
      />

      <p className="petition__intro">
        {/* Bittet eine KI, euch einen Text mit 100 Wörtern zu generieren, der zum Thema
passt. */}
        Wale sind faszinierende und majestätische Geschöpfe, die eine
        entscheidende Rolle in unseren Ozeanen spielen. Leider sind viele
        Walarten durch menschliche Aktivitäten wie Walfang, Verschmutzung und
        Klimawandel bedroht. Es ist unsere Verantwortung, diese wunderbaren
        Tiere zu schützen und ihre Lebensräume zu bewahren. Indem wir diese
        Petition unterschreiben, setzen wir ein Zeichen für den Schutz der Wale
        und fordern strengere Maßnahmen zur Erhaltung ihrer Populationen.
        Gemeinsam können wir dazu beitragen, dass zukünftige Generationen die
        Schönheit und Bedeutung dieser Meeresriesen erleben können.
        Unterschreiben Sie jetzt und helfen Sie, die Wale zu retten!
      </p>
      <strong>Schon {totalSignatures} haben unterschrieben!</strong>

      {/* Nutzt das start-Attribut von ol, um die korrekten Nummern anzuzeigen.
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
*/}
      <ol
        className="petition__list"
        start={(pageNumber - 1) * perPageNumber + 1}
      >
        {signatures.map(({ id, name, date }) => (
          <li key={id}>
            {name || 'Freund*in der Wale'} (
            <time dateTime={date.toISOString().substring(0, 10)}>
              {date.toLocaleDateString('de')}
            </time>
            )
          </li>
        ))}
      </ol>
      {/* 
			Fügt hier zwei Next-Link-Komponenten ein, mit denen man auf die jeweils nächste
			Seite navigieren kann. Der Link "Weitere" bzw. "Vorige Unterschriften" soll nur
			sichtbar sein, wenn es weitere bzw. vorige Unterschriten gibt. Die Links sollen
      auf die Petitionsseite verweisen, aber mit den passenden page und
      (falls vom Standardwert abweichend) perPage-Parametern.
			*/}

      {totalPageCount > 1 && (
        <nav className="petition__pagination" aria-label="Pagination">
          {pageNumber > 1 && (
            <Link
              href={`/petition?page=${pageNumber - 1}${perPageParam}`}
              scroll={false}
            >
              Vorige Unterschriften
            </Link>
          )}
          {pageNumber < totalPageCount && (
            <Link
              href={`/petition?page=${pageNumber + 1}${perPageParam}`}
              scroll={false}
            >
              Weitere Unterschriften
            </Link>
          )}
        </nav>
      )}
      <PendingSignatures />
    </>
  );
}
