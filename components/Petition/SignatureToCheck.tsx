'use client';

import type { Signature } from '@prisma/client';
import { approveSignature } from './petitionServerActions';

type Props = Pick<Signature, 'id' | 'name' | 'email'>;
export default function SignatureToCheck({ name, email, id }: Props) {
  return (
    <li className="signature">
      {name} {email}
      <button onClick={() => approveSignature(id, true)}>Annehmen</button>
      <button onClick={() => approveSignature(id, false)}>Löschen</button>
    </li>
  );
}
