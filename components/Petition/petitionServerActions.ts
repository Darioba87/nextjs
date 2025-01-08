'use server';

import prisma from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function approveSignature(id: string, approve: boolean) {
  if (approve) {
    await prisma.signature.update({
      where: {
        id,
      },
      data: {
        approved: true,
      },
    });
  } else {
    await prisma.signature.delete({
      where: {
        id,
      },
    });
  }

  /* 
	Löscht den Cache für die angegebene Route und aktualisiert die Anzeige:
	https://nextjs.org/docs/app/api-reference/functions/revalidatePath */
  revalidatePath('/petition');
}
