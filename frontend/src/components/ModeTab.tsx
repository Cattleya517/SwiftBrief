interface ModeTabProps {
  mode: "manual" | "ocr";
  onModeChange: (mode: "manual" | "ocr") => void;
}

const tabs = [
  { value: "manual" as const, label: "手動填入模式" },
  { value: "ocr" as const, label: "影像轉錄模式" },
];

export default function ModeTab({ mode, onModeChange }: ModeTabProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-300 p-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onModeChange(tab.value)}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
            mode === tab.value
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
