import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";


export default async function ShortUrlRedirectPage({ params }) {
  const { shortCode } = await params;

  if (!shortCode) {
    notFound();
  }

  // Find the matching short URL record
  const record = await prisma.shortUrl.findUnique({
    where: { shortCode },
  });

  if (!record) {
    notFound();
  }

  // Increment the click counter atomically
  try {
    await prisma.shortUrl.update({
      where: { id: record.id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  } catch (err) {
    console.error("Failed to update click counter:", err);
  }

  // Redirect visitor to the original URL (must be outside try/catch as Next.js redirect throws a NEXT_REDIRECT symbol)
  redirect(record.originalUrl);
}
