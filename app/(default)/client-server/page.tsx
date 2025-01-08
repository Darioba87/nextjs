'use client';
import ClientComponent from '@/components/ClientServer/ClientComponent';
// import ClientOnlyComponent from '@/components/ClientServer/ClientOnlyComponent';
import ServerComponent from '@/components/ClientServer/ServerComponent';

import dynamic from 'next/dynamic';

/* dynamic ist die Next-Version von React.lazy, damit wird der JS-Code
für die Komponente erst dann geladen, wenn diese tatsächlich dargestellt wird,
was z.B. sinnvoll ist, wenn eine größere Komponente nur manchmal
nach einer User-Aktion angezeigt wird. Das allein verhindert aber NICHT, 
dass das HTML schon auf dem Server gerendert wird. Wenn man das verhindern
möchte, weil der Code nur im Browser funktioniert (z.B. auf window oder document
zugreift), muss man zusätzlich die ssr-Option (Server-Side-Rendering) auf false setzen.
Achtung: Seit Next 15 kann man dynamic nur in client-Komponenten nutzen. */
const ClientOnlyComponent = dynamic(
  () => import('@/components/ClientServer/ClientOnlyComponent'),
  { ssr: false }
);

/* export const metadata: Metadata = {
  title: 'Client & Server',
}; */

export default function ClientServerPage() {
  return (
    <div>
      <h1>Client & Server</h1>
      <ServerComponent />
      <ClientComponent slot={<ServerComponent />}>
        <ServerComponent />
      </ClientComponent>
      <ClientOnlyComponent />
    </div>
  );
}
