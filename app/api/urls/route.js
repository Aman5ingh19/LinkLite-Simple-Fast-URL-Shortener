import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateUrl, generateUniqueShortCode } from "@/lib/utils";


/**
 * GET /api/urls
 * Fetch all shortened URLs ordered by newest first.
 */
export async function GET() {
  try {
    const urls = await prisma.shortUrl.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: urls,
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve URL history from the database.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/urls
 * Create a new shortened URL with server-side validation and collision checking.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.url) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid 'url' field in the request body.",
        },
        { status: 400 }
      );
    }

    // Validate URL on the server (strict http/https validation)
    const validation = validateUrl(body.url);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // Generate unique short code with collision handling
    const shortCode = await generateUniqueShortCode(prisma);

    // Save record to PostgreSQL via Prisma
    const newShortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl: validation.normalizedUrl,
        shortCode,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Short URL generated successfully.",
        data: newShortUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating short URL:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "An error occurred while creating the short URL. Please try again.",
      },
      { status: 500 }
    );
  }
}
