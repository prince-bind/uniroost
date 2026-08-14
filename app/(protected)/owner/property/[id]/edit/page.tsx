import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
import Link from "next/link";
import PropertyForm from "@/components/PropertyForm";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    redirect("/login");
  }

  const { id } = await params;

  const [property, user] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
      include: { amenities: true, images: true, colleges: true },
    }),
    prisma.user.findUnique({ where: { email: session.user.email } }),
  ]);

  if (!property || property.ownerId !== user?.id) {
    redirect("/owner");
  }

  const [amenities, colleges] = await Promise.all([
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
    prisma.college.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/owner/property/${property.id}`}
          className="p-3 bg-white shadow-md hover:shadow-lg rounded-2xl border border-gray-100 transition-all active:scale-90 group shrink-0"
        >
          <ArrowLeft size={22} className="text-gray-500 group-hover:text-cyan-600 transition-colors" />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <PencilLine size={13} className="text-cyan-600" />
            <span className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">Editing</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight truncate">
            {property.title}
          </h1>
          <p className="mt-1 text-sm text-gray-600 font-medium">
            Update details, images, amenities or nearby colleges.
          </p>
        </div>
      </div>

      <PropertyForm property={property} allAmenities={amenities} allColleges={colleges} />
    </div>
  );
}
