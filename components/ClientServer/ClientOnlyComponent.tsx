'use client';

import { useEffect, useState } from 'react';

export default function ClientOnlyComponent() {
  const [windowHeight, setWindowHeight] = useState(0);

  /* useEffect wird erst nach dem ersten Rendern ausgeführt, es ist also
  kein Problem, wenn durch den Effekt ein anderes HTML als auf dem Server
  produziert wird. */
  useEffect(() => setWindowHeight(window.innerHeight), []);

  const isServer = typeof window === 'undefined';

  const renderInfo = `ClientOnly-Komponente gerendert auf ${
    isServer ? 'Server' : 'Client'
  }`;

  console.log(renderInfo);

  /* Konditionales Rendern, das auf Server und Client unterschiedliche
	Ausgaben erzeugt, sollte vermieden werden und erzeugt einen Hydration-Error */
  /*  if (isServer) {
    return null;
  } */

  return (
    <div style={{ color: 'purple' }}>
      ClientOnlyComponent
      <div>Bildschirmhöhe: {windowHeight || 'Berechnen…'}</div>
      <div>Bildschirmbreite: {window.innerWidth}</div>
    </div>
  );
}
