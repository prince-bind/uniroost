import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, shortName, city, state, zipcode, websiteUrl, latitude, longitude } = await req.json();

    if (!name || !city || !state) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const college = await prisma.college.create({
      data: {
        name,
        shortName: shortName || null,
        city,
        state,
        zipcode: zipcode || null,
        websiteUrl: websiteUrl || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });

    revalidatePath("/admin/colleges");
    revalidatePath("/owner/property/new");
    return NextResponse.json(college);
  } catch (error: any) {
    console.error("Error adding college:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "College already exists in this city" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const colleges = await prisma.college.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(colleges);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    await prisma.college.delete({
      where: { id },
    });

    revalidatePath("/admin/colleges");
    revalidatePath("/owner/property/new");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting college:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
