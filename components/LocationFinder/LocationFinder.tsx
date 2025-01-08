'use client';

import { getDistance, getUserLocation } from '@/lib/helpers';
import type { LatLng } from '@/types/location-types';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import allLocations from '@/lib/cimdataLocations';
import LocationsList from './LocationsList';
import dynamic from 'next/dynamic';
// Achtung, useRouter für Next ab Version 13 mit App-Verzeichnis nicht von next/router importieren!
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LocationSearch from './LocationSearch';

/* Weil Leaflet APIs nutzt, die nur im Browser zur Verfügung stehen, müssen wir dafür sorgen,
dass die Komponente nicht auf der Server gerendert wird. */
const LocationMap = dynamic(
  () => import('@/components/LocationFinder/LocationMap'),
  { ssr: false }
);

// Mitte von Deutschland
const defaultCenter = { lat: 51.1864708, lng: 10.0671016 };
const defaultZoom = 6;

/* // Verursacht Hydration-Fehler
const navigatorAvailable =
  typeof window !== 'undefined' && 'geolocation' in window.navigator; */

export default function LocationFinder() {
  // https://nextjs.org/docs/app/api-reference/functions/use-router
  const router = useRouter();
  // https://nextjs.org/docs/app/api-reference/functions/use-pathname
  // Pfad ohne Domain und Suchparameter:
  const path = usePathname();
  // https://nextjs.org/docs/app/api-reference/functions/use-search-params
  const searchParams = useSearchParams();

  const [navigatorAvailable, setNavigatorAvailable] = useState(false);
  const [geolocationError, setGeolocationError] = useState('');
  const [userLocation, setUserLocation] = useState<LatLng | null>(() =>
    getInitialUserLocation(searchParams)
  );
  const [showMap, setShowMap] = useState(false);
  const [zoom, setZoom] = useState(defaultZoom);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => setNavigatorAvailable('geolocation' in window.navigator), []);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(11);
      router.replace(`?lat=${userLocation.lat}&lng=${userLocation.lng}`);
    } else {
      reset();
      router.replace(path);
    }
  }, [userLocation, path, router]);

  function reset() {
    setZoom(defaultZoom);
    setMapCenter(defaultCenter);
    setUserLocation(null);
    setGeolocationError('');
  }

  /* 4. Speichert in die neue Variable visibleLocations entweder allLocations (wenn
		userLocation null ist) oder den Rückgabewert von getLocationsInRadius, wobei dann
		die userLocation übergeben werden soll. */

  const visibleLocations = userLocation
    ? getLocationsInRadius(userLocation)
    : allLocations;

  const isDefault =
    mapCenter === defaultCenter &&
    zoom === defaultZoom &&
    userLocation === null &&
    geolocationError === '';

  return (
    <div className="location-finder">
      {navigatorAvailable && (
        <button
          onClick={() =>
            showNearLocations(setGeolocationError, setUserLocation)
          }
        >
          Zeige Standorte in meiner Nähe
        </button>
      )}
      {geolocationError && (
        <strong className="location-finder__error">{geolocationError}</strong>
      )}
      <LocationSearch mapReset={reset} setUserLocation={setUserLocation} />
      {/* Button soll nur angezeigt werden, wenn es Werte zum zurücksetzen gibt, d.h.
wenn nicht alle Werte ihre Default-Werte haben */}
      {isDefault || <button onClick={reset}>Zurücksetzen</button>}

      {/* 5. Gebt visibleLocations statt allLocations in Map  */}
      {showMap ? (
        <LocationMap
          locations={visibleLocations}
          zoom={zoom}
          center={mapCenter}
        />
      ) : (
        <div className="location-finder__show-map">
          <button
            aria-describedby="map-privacy-info"
            onClick={() => setShowMap(true)}
          >
            Karte anzeigen
          </button>
          <small id="map-privacy-info">
            Wenn Sie die Karte anzeigen, stimmen Sie der Datenschutzerklärung
            zu.
          </small>
        </div>
      )}

      {/* 8. Erstellt eine neue Komponente namens LocationList, welche
			eine Liste (ul-Element) mit den Standorten darstellt, und dabei falls vorhanden
			auch die Distanz nach dem Namen anzeigt. Beispiel: <li>Lübeck (10,5 km)</li> */}
      <LocationsList locations={visibleLocations} />
      {/* 9. Wenn kein Standort gefunden wurde, eine Meldung anzeigen. */}
      {visibleLocations.length === 0 && <strong>Kein Standort gefunden</strong>}
    </div>
  );
}

/* 1. Gebt Parameter center und radius (mit Standardwert 10) in die Funktion. */
function getLocationsInRadius(center: LatLng, radius = 10) {
  /* 2. Filtert allLocations so, dass nur Standorte im Radius in dem
	neuen Array locationsInRadius enthalten sind. Nutzt dafür die
	Funktion getDistance. */

  const clonedLocations = structuredClone(allLocations);

  const locationsInRadius = clonedLocations.filter((location) => {
    const distance = getDistance(
      center.lat,
      center.lng,
      location.latLng.lat,
      location.latLng.lng
    );

    location.distance = distance;

    return distance <= radius;
  });

  /* 6. Ändert den Typ für CimdataLocation so, dass er eine optionale Eigenschaft
namens distance vom Typ number hat. Speichert in jede Location den
Rückgabewert von getDistance. */
  /* 7. Sortiert den Array locationsInRadius nach der distance-Eigenschaft. */

  const sortedLocations = locationsInRadius.toSorted(
    (a, b) => a.distance! - b.distance!
  );

  /* 3. Gebt locationsInRadius zurück */

  return sortedLocations;
}

async function showNearLocations(
  setGeolocationError: Dispatch<SetStateAction<string>>,
  setUserLocation: Dispatch<SetStateAction<LatLng | null>>
) {
  try {
    const location = await getUserLocation();

    const userLocation = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };

    setUserLocation(userLocation);
    setGeolocationError('');
  } catch (error) {
    if (!(error instanceof GeolocationPositionError)) {
      console.log(error);
      setGeolocationError('Ein unbekannter Fehler ist aufgetreten.');
      return;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/PositionError
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setGeolocationError(
          'Sie müssen die Erlaubnis zur Standortermittlung erteilen.'
        );
        break;

      case error.POSITION_UNAVAILABLE:
        setGeolocationError(
          'Ihr Standort konnte aus technischen Gründen nicht ermittelt werden.'
        );
        break;

      case error.TIMEOUT:
        setGeolocationError('Die Standortermittlung dauerte zu lange.');
    }
  }
}

function getInitialUserLocation(searchParams: URLSearchParams) {
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));

  if (!lat || !lng) {
    return null;
  }

  return {
    lat,
    lng,
  };
}
