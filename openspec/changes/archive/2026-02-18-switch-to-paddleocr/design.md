## Context

目前 `ocr_service.py` 透過 `httpx` 呼叫外部 Umi-OCR 服務（`127.0.0.1:1224`），使用者需要額外下載並啟動 Umi-OCR 應用程式。PaddleOCR 是 Python library，可直接 `pip install` 嵌入後端進程，消除外部服務依賴。

現有流程：`image bytes → base64 → HTTP POST Umi-OCR → raw text → Ollama LLM → structured JSON`

目標流程：`image bytes → PaddleOCR (in-process) → raw text → Ollama LLM → structured JSON`

## Goals / Non-Goals

**Goals:**
- 用 PaddleOCR PP-OCRv5 取代 Umi-OCR，減少一個外部服務
- 保持 `extract_text(image_bytes) -> str` 的函式簽名不變，router 層零改動
- 保持 API 契約不變，前端零改動

**Non-Goals:**
- 不切換 LLM 引擎（Ollama + instructor 保持不變）
- 不引入 PaddleOCR-VL 視覺語言模型（目前文字 OCR 即足夠）
- 不改變前端任何行為

## Decisions

### 1. PaddleOCR 作為 Python 依賴直接嵌入

**選擇**: `pip install paddleocr`，在後端進程內直接呼叫

**理由**: 比起維護獨立 OCR 服務，in-process 呼叫更簡單、無網路延遲、部署只需 `uv sync`

**替代方案**: 用 PaddleOCR 的 Serving 模式部署獨立服務 → 拒絕，因為跟 Umi-OCR 一樣需要額外管理

### 2. 使用 PP-OCRv5 server 模型

**選擇**: 預設 server 模型（`PP-OCRv5_server_det` + `PP-OCRv5_server_rec`）

**理由**: 準確率比 mobile 版高，後端跑在有 GPU 或足夠 CPU 資源的機器上

**替代方案**: mobile 模型 → 適合邊緣裝置，但本案後端是本地桌機，server 版更合適

### 3. 全域單例初始化 PaddleOCR

**選擇**: 模組層級建立 `PaddleOCR()` 實例，避免每次請求都重新載入模型

**理由**: PP-OCRv5 模型載入約需數秒，單例模式確保只載入一次

### 4. extract_text 改為同步函式

**選擇**: `extract_text` 從 `async` 改回 `def`（同步）

**理由**: PaddleOCR 是同步 Python API，不需要 async。FastAPI 會自動在 threadpool 中執行同步路由函式

### 5. 移除 httpx 依賴

**選擇**: 從 `pyproject.toml` 移除 `httpx`

**理由**: 不再需要呼叫外部 HTTP 服務

## Risks / Trade-offs

- **首次啟動較慢** → 第一次執行時 PaddleOCR 會自動下載模型（約數百 MB）。後續啟動使用快取，不再下載
- **記憶體佔用增加** → 模型常駐記憶體約 200-400MB。對桌機環境可接受
- **PaddlePaddle 依賴較大** → 安裝包體積比 httpx 大得多，但只需安裝一次
