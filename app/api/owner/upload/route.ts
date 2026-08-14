import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server." },
        { status: 500 }
      );
    }

    // Build the signed upload request
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = "uniroost/properties";

    // Generate SHA-1 signature
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // Prepare multipart form data for Cloudinary
    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", file);
    cloudinaryForm.append("api_key", apiKey);
    cloudinaryForm.append("timestamp", timestamp);
    cloudinaryForm.append("signature", signature);
    cloudinaryForm.append("folder", folder);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    if (!cloudinaryRes.ok) {
      const err = await cloudinaryRes.json();
      console.error("Cloudinary error:", err);
      return NextResponse.json(
        { error: err.error?.message || "Upload to Cloudinary failed." },
        { status: 500 }
      );
    }

    const result = await cloudinaryRes.json();

    return NextResponse.json({
      url: result.secure_url as string,
      publicId: result.public_id as string,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: "No publicId provided" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server." },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("public_id", publicId);
    cloudinaryForm.append("api_key", apiKey);
    cloudinaryForm.append("timestamp", timestamp);
    cloudinaryForm.append("signature", signature);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    if (!cloudinaryRes.ok) {
      const err = await cloudinaryRes.json();
      console.error("Cloudinary destroy error:", err);
      return NextResponse.json(
        { error: err.error?.message || "Delete from Cloudinary failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
