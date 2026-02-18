# SwiftBrief

民事本票裁定聲請狀產生器 — 填入資料即可產生法律文書 PDF，支援影像轉錄模式自動辨識本票照片。

## 架構

```
使用者上傳本票照片
        │
        ▼
  ┌─────────────┐     ┌───────────────────────────┐
  │  Frontend    │────▶│  Backend (FastAPI)         │
  │  Next.js     │     │  port 8000                │
  │  port 3000   │     │                           │
  └─────────────┘     │  ┌───────────────────┐    │
                      │  │ PaddleOCR PP-OCRv5 │    │
                      │  │ (in-process OCR)   │    │
                      │  └───────────────────┘    │
                      └─────────┬─────────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  Ollama      │
                         │  本地 LLM    │
                         │  port 11434  │
                         └──────────────┘
```

**完全離線方案** — OCR 和 LLM 都在本地執行，法律文書資料不出本機。

## 前置需求

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **uv** — Python 套件管理 ([安裝](https://docs.astral.sh/uv/getting-started/installation/))
- **Ollama** — 本地 LLM 推論引擎

## 啟動本地服務

Backend 和 Ollama 需要同時運行。PaddleOCR 已內建在後端，不需要額外啟動。

### 1. Ollama + Qwen2.5

安裝 Ollama：

```bash
# macOS
brew install ollama
```

或從 [ollama.com](https://ollama.com/download) 下載安裝。

下載模型並啟動服務：

```bash
# 下載 Qwen2.5 模型（首次需要，約 4.7GB）
ollama pull qwen2.5

# 啟動 Ollama 服務（若尚未以系統服務啟動）
ollama serve
```

驗證服務是否正常：

```bash
curl http://127.0.0.1:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "qwen2.5", "messages": [{"role": "user", "content": "你好"}]}'
```

### 2. Backend（FastAPI）

```bash
cd backend
uv sync          # 安裝 Python 依賴
uv run uvicorn app.main:app --reload
```

服務啟動於 `http://localhost:8000`。

驗證：

```bash
curl http://localhost:8000/health
# {"status": "ok"}
```

首次啟動時，PaddleOCR 會自動下載 PP-OCRv5 模型（約數百 MB），後續啟動使用快取。

### 3. Frontend（Next.js）

```bash
cd frontend
npm install      # 安裝 Node 依賴
npm run dev
```

開啟瀏覽器前往 `http://localhost:3000`。

## 使用方式

### 手動填入模式

直接在表單中填入當事人資料、本票資訊，右側即時預覽，完成後下載 PDF。

### 影像轉錄模式

1. 點擊頂部的「影像轉錄模式」切換
2. 拖曳或點擊上傳本票照片（JPG / PNG / HEIC，≤ 10MB）
3. 系統自動辨識並填入表單欄位
4. 確認 / 修改辨識結果後下載 PDF

## 環境變數

所有環境變數皆有預設值，不設定也能運行。

### Backend（`backend/.env`）

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434/v1` | Ollama API 位址 |
| `OLLAMA_MODEL` | `qwen2.5` | 使用的 LLM 模型名稱 |

### Frontend（`frontend/.env.local`）

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API 位址 |

## API

### `POST /api/ocr`

上傳本票圖片，回傳結構化辨識結果。

**Request**: `multipart/form-data`，欄位 `image`

**Response**:

```json
{
  "success": true,
  "data": {
    "note": {
      "noteNumber": "TH0001234",
      "issueDate": "2024-06-01",
      "dueDate": "2025-01-15",
      "amount": 500000
    },
    "respondent": {
      "name": "王大明",
      "idNumber": "A123456789",
      "address": "臺北市中正區重慶南路一段122號"
    }
  },
  "rawText": "OCR 原始辨識文字..."
}
```

未偵測到的欄位不會出現在回應中。
