import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Users, Home, Building2, CheckCircle2, ChevronRight, Search, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const [totalStudents, totalOwners, totalProperties, unverifiedOwners] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'OWNER' } }),
    prisma.property.count(),
    prisma.user.findMany({
      where: { role: 'OWNER', isVerified: false },
      select: { id: true, name: true, email: true, createdAt: true, phone: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Control Panel</h1>
          <p className="mt-1 text-sm text-gray-600 font-medium">Platform overview, metrics, and owner verifications.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/admin/amenities" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm">
            <Sparkles size={18} className="text-violet-500" />
            Manage Amenities
          </Link>
          <Link href="/admin/colleges" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm">
            <Building2 size={18} className="text-purple-600" />
            Manage Colleges
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] shadow-xl shadow-blue-900/20 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
            <Users size={120} />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl w-fit mb-4">
              <Users size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-blue-100 uppercase tracking-widest">Total Students</p>
            <p className="text-4xl font-black mt-1">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-fuchsia-700 p-6 rounded-[2rem] shadow-xl shadow-purple-900/20 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
            <Building2 size={120} />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl w-fit mb-4">
              <Building2 size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-purple-100 uppercase tracking-widest">Total Owners</p>
            <p className="text-4xl font-black mt-1">{totalOwners}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-teal-700 p-6 rounded-[2rem] shadow-xl shadow-cyan-900/20 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
            <Home size={120} />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl w-fit mb-4">
              <Home size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-cyan-100 uppercase tracking-widest">Total Properties</p>
            <p className="text-4xl font-black mt-1">{totalProperties}</p>
          </div>
        </div>
      </div>

      {/* Unverified Owners Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-extrabold text-gray-900">Pending Owner Verifications</h2>
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search owners..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 bg-white shadow-sm" />
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-white/80 overflow-hidden">
          {unverifiedOwners.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">All caught up!</h3>
              <p className="mt-1 text-sm text-gray-500 font-medium">There are no pending owner verifications at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Owner Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Joined Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {unverifiedOwners.map((owner) => (
                    <tr key={owner.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                            {owner.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{owner.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{owner.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 font-medium">{owner.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 font-medium">
                          {new Date(owner.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/verifyowner?id=${owner.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-xl hover:bg-green-100 hover:shadow-sm transition-all active:scale-95 group-hover:bg-green-500 group-hover:text-white">
                          <CheckCircle2 size={14} />
                          Verify Owner
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
