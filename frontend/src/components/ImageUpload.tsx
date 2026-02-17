"use client";

import { useState, useRef, useCallback } from "react";
import { submitOCR, OCRResponse } from "@/lib/api";

type Status = "idle" | "selected" | "loading" | "success" | "error";

interface ImageUploadProps {
  onOCRComplete: (data: OCRResponse["data"]) => void;
}

const ACCEPT = ".jpg,.jpeg,.png,.heic";

export default function ImageUpload({ onOCRComplete }: ImageUploadProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | undefined) => {
    if (!file) return;
    setErrorMsg("");
    setPreview(URL.createObjectURL(file));
    setStatus("selected");
  }, []);

  const handleUpload = useCallback(
    async (file: File) => {
      setStatus("loading");
      setErrorMsg("");
      try {
        const res = await submitOCR(file);
        setStatus("success");
        onOCRComplete(res.data);
      } catch (e) {
        setStatus("error");
        setErrorMsg(e instanceof Error ? e.message : "辨識失敗，請重試。");
      }
    },
    [onOCRComplete],
  );

  const handleSelect = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      handleFile(file);
      handleUpload(file);
    },
    [handleFile, handleUpload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleSelect(e.dataTransfer.files[0]);
    },
    [handleSelect],
  );

  const reset = () => {
    setStatus("idle");
    setPreview(null);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mb-6">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => status !== "loading" && inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl py-8 px-4 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 ${
          status === "error"
            ? "border-red-300 bg-red-50"
            : status === "success"
              ? "border-green-300 bg-green-50"
              : "border-slate-300 hover:border-blue-800/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleSelect(e.target.files?.[0])}
        />

        {status === "loading" && (
          <>
            <svg
              className="animate-spin h-5 w-5 text-slate-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-sm text-slate-500">辨識中，請稍候...</p>
          </>
        )}

        {status === "idle" && (
          <p className="text-sm text-slate-500">
            拖曳或點擊上傳本票照片（JPG / PNG / HEIC）
          </p>
        )}

        {status === "selected" && preview && (
          <img
            src={preview}
            alt="預覽"
            className="max-h-40 rounded-lg object-contain"
          />
        )}

        {status === "success" && (
          <p className="text-sm text-green-600 font-medium">
            辨識完成，資料已填入表單。
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}
      </div>

      {(status === "success" || status === "error") && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            reset();
          }}
          className="mt-2 text-sm text-slate-500 hover:text-slate-700 underline cursor-pointer"
        >
          重新上傳
        </button>
      )}
    </div>
  );
}
