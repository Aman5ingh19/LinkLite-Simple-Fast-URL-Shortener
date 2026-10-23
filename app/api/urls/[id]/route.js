import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/urls/[id]
 * Deletes a shortened URL by its database ID.
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing URL ID in request parameters.",
        },
        { status: 400 }
      );
    }

    // Verify record exists before deletion
    const existing = await prisma.shortUrl.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Short URL record not found or already deleted.",
        },
        { status: 404 }
      );
    }

    await prisma.shortUrl.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Short URL deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting short URL:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete the short URL from the database.",
      },
      { status: 500 }
    );
  }
}
