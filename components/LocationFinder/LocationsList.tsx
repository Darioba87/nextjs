import type { CimdataLocation } from '@/types/location-types';

type Props = {
  locations: CimdataLocation[];
};
export default function LocationsList({ locations }: Props) {
  return (
    <ul>
      {locations.map(({ title, distance }) => (
        <li key={title}>
          {title}{' '}
          {distance !== undefined
            ? `${distance.toFixed(2).replace('.', ',')} km`
            : ''}
        </li>
      ))}
    </ul>
  );
}
