import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== 'OWNER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const existing = await prisma.property.findUnique({ where: { id } });
    
    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    
    if (existing.ownerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, description, rent, rentType, address, city, state, zipcode,
      latitude, longitude,
      type, gender, occupancy, isFurnished, isAvailable, 
      amenityIds, imageUrls, colleges 
    } = body;

    const property = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        rent: parseInt(rent, 10),
        rentType,
        address,
        city,
        state,
        zipcode,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        type,
        gender,
        occupancy,
        isFurnished,
        isAvailable,
        amenities: {
          deleteMany: {},
          create: (amenityIds || []).map((id: string) => ({ amenityId: id }))
        },
        images: {
          deleteMany: {},
          create: (imageUrls || []).filter((url: string) => url.trim() !== "").map((url: string) => ({ url }))
        },
        colleges: {
          deleteMany: {},
          create: (colleges || []).map((c: any) => ({
            collegeId: c.collegeId,
            distanceKm: parseFloat(c.distanceKm)
          }))
        }
      },
    });

    revalidatePath("/owner");
    revalidatePath(`/owner/property/${id}`);
    
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== 'OWNER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const existing = await prisma.property.findUnique({ where: { id } });
    
    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    
    if (existing.ownerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.property.delete({
      where: { id },
    });

    revalidatePath("/owner");
    
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
