import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
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

    const body = await req.json();
    const { 
      title, description, rent, rentType, address, city, state, zipcode,
      latitude, longitude,
      type, gender, occupancy, isFurnished, isAvailable, 
      amenityIds, imageUrls, colleges 
    } = body;

    const property = await prisma.property.create({
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
        ownerId: user.id,
        amenities: {
          create: (amenityIds || []).map((id: string) => ({ amenityId: id }))
        },
        images: {
          create: (imageUrls || []).filter((url: string) => url.trim() !== "").map((url: string) => ({ url }))
        },
        colleges: {
          create: (colleges || []).map((c: any) => ({
            collegeId: c.collegeId,
            distanceKm: parseFloat(c.distanceKm)
          }))
        }
      },
    });

    revalidatePath("/owner");
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
