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
    const { name, phone, idProofType, idProofNo, profileImage, idProofUrl } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and Phone are required" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        idProofType: idProofType || null,
        idProofNo: idProofNo || null,
        profileImage: profileImage || null,
        idProofUrl: idProofUrl || null,
      },
    });

    revalidatePath("/owner");
    revalidatePath("/owner/profile");
    revalidatePath("/owner/profile/edit");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
