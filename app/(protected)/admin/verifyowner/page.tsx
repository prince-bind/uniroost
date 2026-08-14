import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, UserCircle, Mail, Phone, Calendar, ShieldCheck, ShieldAlert, FileText, CheckCircle2, MessageSquareWarning } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import OwnerActionButtons from "@/components/OwnerActionButtons";

export default async function VerifyOwnerPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const ownerId = resolvedSearchParams.id;

  if (!ownerId) {
    redirect("/admin");
  }

  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
  });

  if (!owner || owner.role !== "OWNER") {
    redirect("/admin");
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gray-50/50" aria-hidden="true" />
      <div className="max-w-5xl mx-auto space-y-10 pb-20 relative pt-4">
        
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="w-12 h-12 bg-white shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-cyan-200/40 hover:border-cyan-200 group shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-400 group-hover:text-cyan-600 transition-colors" />
            </Link>
            
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck size={14} className="text-cyan-600" />
                <span className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">Verification Portal</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Verify Owner</h1>
            </div>
          </div>
          
          {/* Action Buttons */}
          {!owner.isVerified && (
            <OwnerActionButtons ownerId={owner.id} />
          )}
        </div>

        {/* ── Profile Content ────────────────────────────────────────── */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden relative">
          
          <div className="px-8 sm:px-12 pt-12 pb-12 relative z-10 flex flex-col items-center sm:items-start sm:flex-row gap-8">
            {/* Avatar */}
            <div className="shrink-0 relative">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-2xl border border-gray-100">
                {owner.profileImage ? (
                  <div className="w-full h-full relative rounded-full overflow-hidden">
                    <Image 
                      src={owner.profileImage} 
                      alt={owner.name} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-200 rounded-full flex items-center justify-center text-cyan-700 text-5xl font-black">
                    {owner.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-2 right-4">
                {owner.isVerified ? (
                  <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg border-2 border-white" title="Verified Account">
                    <ShieldCheck size={18} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="bg-amber-500 text-white p-2 rounded-full shadow-lg border-2 border-white" title="Pending Verification">
                    <ShieldAlert size={18} strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center sm:text-left flex-1 mt-4 sm:mt-8">
              <h2 className="text-3xl font-black text-gray-900">{owner.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${
                  owner.isVerified 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {owner.isVerified ? "Verified Owner" : "Verification Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Existing remark banner */}
          {owner.remark && (
            <div className="mx-8 sm:mx-12 mb-6 flex items-start gap-4 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <MessageSquareWarning size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-rose-700 uppercase tracking-widest mb-1">Previous Rejection Remark</p>
                <p className="text-sm text-rose-600 font-medium leading-relaxed">{owner.remark}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 px-8 sm:px-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gray-200"></span> Contact Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-3 bg-white text-cyan-600 rounded-xl shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email Address</p>
                    <p className="text-sm font-bold text-gray-900">{owner.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-3 bg-white text-cyan-600 rounded-xl shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                    <p className="text-sm font-bold text-gray-900">{owner.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-3 bg-white text-emerald-500 rounded-xl shadow-sm">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Registered On</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(owner.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Details */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gray-200"></span> Identity Documents
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><FileText size={12}/> Document Type</p>
                    <p className="text-sm font-bold text-gray-900">
                      {owner.idProofType ? owner.idProofType.replace('_', ' ') : "Not Provided"}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><FileText size={12}/> Document Number</p>
                    <p className="text-sm font-bold text-gray-900">
                      {owner.idProofNo || "Not Provided"}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><FileText size={12}/> Document Scan</p>
                  {owner.idProofUrl ? (
                    <a href={owner.idProofUrl} target="_blank" rel="noopener noreferrer" className="block relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-md group">
                      <Image 
                        src={owner.idProofUrl} 
                        alt="ID Document" 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl shadow-xl transition-all translate-y-4 group-hover:translate-y-0">
                          Click to View Full Size
                        </span>
                      </div>
                    </a>
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-bold text-sm bg-white">
                      No document uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
