"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle, MessageSquareWarning, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OwnerActionButtons({ ownerId }: { ownerId: string }) {
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showRejectPanel, setShowRejectPanel] = useState(false);
  const [remark, setRemark] = useState("");
  const [remarkError, setRemarkError] = useState("");
  const router = useRouter();

  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      const res = await fetch("/api/admin/verify-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId }),
      });

      if (!res.ok) throw new Error("Failed to verify owner");

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to verify owner");
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    if (!remark.trim()) {
      setRemarkError("Please provide a remark before rejecting.");
      return;
    }
    setRemarkError("");
    setRejectLoading(true);
    try {
      const res = await fetch("/api/admin/reject-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, remark: remark.trim() }),
      });

      if (!res.ok) throw new Error("Failed to reject owner");

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to reject owner");
      setRejectLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
      {/* Action row */}
      <div className="flex items-center gap-3 flex-wrap justify-end">
        {/* Reject toggle button */}
        <button
          onClick={() => setShowRejectPanel((p) => !p)}
          disabled={approveLoading}
          className={`inline-flex items-center gap-2 px-6 py-4 font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group border ${
            showRejectPanel
              ? "bg-rose-600 text-white border-rose-600 shadow-rose-500/20"
              : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50 shadow-gray-200/40"
          }`}
        >
          <XCircle size={18} className="group-hover:scale-110 transition-transform" />
          Reject
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${showRejectPanel ? "rotate-180" : ""}`}
          />
        </button>

        {/* Approve button */}
        <button
          onClick={handleApprove}
          disabled={approveLoading || rejectLoading}
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all active:scale-95 shadow-xl shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {approveLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
          )}
          Approve & Verify
        </button>
      </div>

      {/* Reject panel — slides in below */}
      {showRejectPanel && (
        <div className="w-full sm:w-[480px] bg-white border border-rose-200 rounded-2xl shadow-xl shadow-rose-100/50 p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <MessageSquareWarning size={16} />
            </div>
            <div>
              <p className="text-sm font-black text-rose-700">Rejection Remark</p>
              <p className="text-xs text-rose-500 font-medium">
                This message will be visible to the owner on their dashboard.
              </p>
            </div>
          </div>

          <textarea
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value);
              if (e.target.value.trim()) setRemarkError("");
            }}
            rows={3}
            placeholder="e.g. Document image is blurry. Please upload a clearer photo of your ID proof."
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
              remarkError
                ? "border-rose-400 focus:ring-rose-200"
                : "border-gray-200 focus:ring-rose-100 focus:border-rose-300"
            }`}
          />

          {remarkError && (
            <p className="text-xs font-bold text-rose-600">{remarkError}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowRejectPanel(false);
                setRemark("");
                setRemarkError("");
              }}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={rejectLoading || approveLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white text-sm font-black rounded-xl hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-rose-200"
            >
              {rejectLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <XCircle size={15} />
              )}
              Confirm Rejection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
