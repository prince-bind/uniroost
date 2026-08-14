import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// GET — list all amenities (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const amenities = await prisma.amenity.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { properties: true } },
      },
    });
    return NextResponse.json(amenities);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST — create a new amenity
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Amenity name is required." }, { status: 400 });
    }

    const amenity = await prisma.amenity.create({
      data: { name: name.trim() },
      include: { _count: { select: { properties: true } } },
    });

    revalidatePath("/admin/amenities");
    revalidatePath("/owner/property/new");
    return NextResponse.json(amenity, { status: 201 });
  } catch (error: any) {
    console.error("Error creating amenity:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "An amenity with this name already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE — remove an amenity by id
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Amenity ID is required." }, { status: 400 });
    }

    await prisma.amenity.delete({ where: { id } });

    revalidatePath("/admin/amenities");
    revalidatePath("/owner/property/new");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting amenity:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Amenity not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
