import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ownerId, remark } = await req.json();

    if (!ownerId) {
      return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
    }

    if (!remark || !remark.trim()) {
      return NextResponse.json({ error: "Remark is required when rejecting" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: ownerId },
      data: {
        isVerified: false,
        remark: remark.trim(),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/verifyowner");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting owner:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
