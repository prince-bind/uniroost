import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, UserCircle, Mail, Phone, Calendar, ShieldCheck, ShieldAlert, FileText, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function OwnerProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gray-50/50" aria-hidden="true" />
      <div className="max-w-4xl mx-auto space-y-8 pb-20 relative pt-4">
        
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
          <div className="flex items-center gap-6">
            <Link
              href="/owner"
              className="w-12 h-12 bg-white shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-cyan-200/40 hover:border-cyan-200 group shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-400 group-hover:text-cyan-600 transition-colors" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <UserCircle size={14} className="text-cyan-600" />
                <span className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">Profile</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Owner Profile</h1>
            </div>
          </div>
          
          <Link
            href="/owner/profile/edit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl hover:bg-gray-50 hover:border-cyan-200 hover:text-cyan-700 transition-all active:scale-95 shadow-sm shrink-0"
          >
            Edit Profile
          </Link>
        </div>

        {/* ── Profile Content ────────────────────────────────────────── */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden relative">
          {/* Cover gradient */}
          <div className="h-40 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 w-full absolute top-0 left-0" />
          
          <div className="px-8 sm:px-12 pt-24 pb-12 relative z-10 flex flex-col items-center sm:items-start sm:flex-row gap-8">
            {/* Avatar */}
            <div className="shrink-0 relative">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-2xl border border-gray-100">
                {user.profileImage ? (
                  <div className="w-full h-full relative rounded-full overflow-hidden">
                    <Image 
                      src={user.profileImage} 
                      alt={user.name} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-200 rounded-full flex items-center justify-center text-cyan-700 text-5xl font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-2 right-4">
                {user.isVerified ? (
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
              <h2 className="text-3xl font-black text-gray-900">{user.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${
                  user.isVerified 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {user.isVerified ? "Verified Owner" : "Verification Pending"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm bg-gray-50 text-gray-600 border border-gray-200">
                  <Clock size={13} /> Joined {new Date(user.createdAt).getFullYear()}
                </span>
              </div>
            </div>
          </div>

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
                    <p className="text-sm font-bold text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-3 bg-white text-cyan-600 rounded-xl shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                    <p className="text-sm font-bold text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gray-200"></span> Account & Verification
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-3 bg-white text-indigo-500 rounded-xl shadow-sm">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ID Proof Type</p>
                    <p className="text-sm font-bold text-gray-900">
                      {user.idProofType ? user.idProofType.replace('_', ' ') : "Not Provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-3 bg-white text-indigo-500 rounded-xl shadow-sm">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ID Document Number</p>
                    <p className="text-sm font-bold text-gray-900">
                      {user.idProofNo || "Not Provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-3 bg-white text-emerald-500 rounded-xl shadow-sm">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Member Since</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}