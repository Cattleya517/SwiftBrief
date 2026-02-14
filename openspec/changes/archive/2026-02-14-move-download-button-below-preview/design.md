## Context

在 `page.tsx` 的右側面板中，目前的排列順序為：
1. `PdfDownloadButton`（第 73-78 行）
2. 「即時預覽」標籤（第 80-82 行）
3. `PetitionPreview`（第 83 行）

需要將 `PdfDownloadButton` 移至 `PetitionPreview` 之後。

## Goals / Non-Goals

**Goals:**
- 將下載按鈕移至預覽區下方
- 保持 sticky 滾動行為不變

**Non-Goals:**
- 不改變按鈕本身的樣式或功能
- 不調整預覽元件的結構

## Decisions

### Decision 1: 僅調整 JSX 順序

在 `page.tsx` 右側面板 `<div>` 中，將 `PdfDownloadButton` 的 `<div className="mb-4">` 區塊從 `PetitionPreview` 之前移至之後。同時將 `mb-4` 改為 `mt-4`（上方間距），維持視覺間距。

不需要修改任何其他檔案或元件。

## Risks / Trade-offs

- **sticky 面板**: 在 lg 斷點以上，右側面板有 `lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto`，按鈕移至底部後，如果預覽內容很長，使用者需要捲動到底部才能看到按鈕。但此面板本身已有 `overflow-y-auto`，可正常捲動，且符合「先看預覽再下載」的操作邏輯。
