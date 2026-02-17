"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "disclaimer_accepted";

function ShieldIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1E3A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1E3A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1E3A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <path d="M5 7l7-4 7 4" />
      <path d="M5 7l-1 6h6L9 7" />
      <path d="M19 7l-1 6h6l-1-6" />
      <circle cx="4" cy="13" r="0" />
      <path d="M2 13a3 3 0 006 0" />
      <path d="M16 13a3 3 0 006 0" />
    </svg>
  );
}

const disclaimerItems = [
  {
    icon: <ShieldIcon />,
    title: "免責條款",
    text: "本工具僅提供文書格式產生之輔助功能，所產生之內容不構成法律意見，本站不負任何法律責任。",
  },
  {
    icon: <LockIcon />,
    title: "隱私聲明",
    text: "本網站不儲存、不記錄任何使用者輸入之資料。使用者應自行確認所產生文件內容之正確性與完整性。",
  },
  {
    icon: <ScaleIcon />,
    title: "專業建議",
    text: "如涉及具體法律問題，建議諮詢專業律師以獲得適當之法律協助。",
  },
];

export default function DisclaimerModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (accepted !== "true") {
      setShowModal(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "true");
    setShowModal(false);
  }

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="text-center text-xl font-bold text-slate-900">
          免責聲明
        </h2>

        <div className="my-5 border-t border-slate-200" />

        <div className="space-y-5">
          {disclaimerItems.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-5 border-t border-slate-200" />

        <button
          onClick={handleAccept}
          className="w-full cursor-pointer rounded-lg bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
        >
          我已閱讀並同意
        </button>
      </div>
    </div>
  );
}
