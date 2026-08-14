import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import PropertyForm from "@/components/PropertyForm";

export default async function NewPropertyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    redirect("/login");
  }

  const [amenities, colleges] = await Promise.all([
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
    prisma.college.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gray-50/50" aria-hidden="true" />
      <div className="max-w-4xl mx-auto space-y-10 pb-20 relative pt-4">
        
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 px-2">
          <Link
            href="/owner"
            className="w-12 h-12 bg-white shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-cyan-200/40 hover:border-cyan-200 group shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-cyan-600 transition-colors" />
          </Link>
          
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={14} className="text-cyan-600" />
              <span className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">New Listing</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add New Property</h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Provide comprehensive details to attract the best tenants.
            </p>
          </div>
        </div>

        {/* ── Form ───────────────────────────────────────────────────── */}
        <PropertyForm allAmenities={amenities} allColleges={colleges} />
      </div>
    </>
  );
}
