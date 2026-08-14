import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Mail, Phone, ShieldCheck, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Profile</h1>
        <p className="mt-2 text-sm text-gray-600 font-medium">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-gray-200/50 rounded-[2.5rem] border border-white/50 ring-1 ring-gray-900/5 overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="h-24 w-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-[2rem] flex items-center justify-center text-cyan-700 text-3xl font-extrabold shadow-inner border border-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">{user.name}</h2>
              <div className="flex flex-wrap items-center mt-2 gap-2">
                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 shadow-sm border border-green-200">
                    <ShieldCheck size={14} /> Verified Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 shadow-sm border border-yellow-200">
                    <ShieldAlert size={14} /> Unverified Account
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 shadow-sm border border-gray-200 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-100 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="mt-2 flex items-center text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                <Mail size={18} className="text-cyan-600 mr-3" />
                {user.email}
              </div>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="mt-2 flex items-center text-gray-900 font-semibold bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                <Phone size={18} className="text-cyan-600 mr-3" />
                {user.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
