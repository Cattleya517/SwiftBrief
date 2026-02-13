## Context

SwiftBrief 為全新專案，目前無既有程式碼。目標是建立一個繁體中文 Web App，讓台灣使用者能填寫表單並產生民事本票裁定聲請狀 PDF。

架構採前後端分離：Next.js 前端 + Python FastAPI 後端。目前後端僅提供基礎健康檢查端點，未來將擴充圖片辨識（OCR）自動填入功能。

核心限制條件：
- PDF 產生仍在瀏覽器端完成（不經後端）
- PDF 必須支援繁體中文且符合法院格式
- 介面全繁體中文
- 後端架構就位，為未來 OCR 功能做準備

## Goals / Non-Goals

**Goals:**
- 使用者能透過表單填寫所有聲請狀必要資訊
- 即時預覽符合法院格式的聲請狀
- 前端產生可列印的 A4 PDF
- 身分證字號驗證、金額中文大寫轉換、民國紀年轉換等台灣在地化功能
- 建立 Python FastAPI 後端骨架，為未來 OCR 功能預備

**Non-Goals:**
- 圖片辨識自動填入（未來功能，本次只建後端骨架）
- 使用者帳號或登入系統
- 資料庫（本版本無持久化需求）
- 多語系支援（僅繁體中文）
- 其他類型聲請狀（僅限本票裁定）

## Decisions

### Decision 1: 整體架構 — Next.js 前端 + FastAPI 後端（Monorepo）

**選擇**: Monorepo 結構，前端與後端放在同一 repo

```
SwiftBrief/
├── frontend/          ← Next.js App
│   ├── src/
│   │   ├── app/           ← App Router 頁面
│   │   ├── components/    ← React 元件
│   │   ├── lib/           ← 工具函式（驗證、轉換）
│   │   └── types/         ← TypeScript 型別定義
│   ├── package.json
│   └── next.config.js
├── backend/           ← FastAPI App
│   ├── app/
│   │   ├── main.py        ← FastAPI 入口
│   │   ├── routers/       ← API 路由（未來 OCR 在此擴充）
│   │   └── services/      ← 業務邏輯（未來 OCR 服務在此）
│   ├── requirements.txt
│   └── pyproject.toml
├── openspec/          ← OpenSpec 規格文件
└── README.md
```

**理由**:
- Monorepo 方便同時開發前後端，共享文件與版本管理
- 前後端職責清晰分離
- 未來 OCR 功能直接在 `backend/` 擴充，不需調整專案結構

**替代方案**:
- 分開兩個 repo：管理成本較高，早期開發不便
- Next.js API Routes 代替 Python：Node.js 的 OCR 生態不如 Python 成熟

### Decision 2: 前端框架 — Next.js (App Router) + TypeScript

**選擇**: Next.js 14+ with App Router, TypeScript, Tailwind CSS

**理由**:
- TypeScript 提供型別安全，適合表單資料結構複雜的場景
- Tailwind CSS 快速建構繁體中文友善的響應式介面
- App Router 提供現代 React 架構
- 可獨立開發與部署，不依賴後端即可運作（PDF 產生為前端功能）

**替代方案**:
- Nuxt.js：Vue 生態系，同樣可行
- Vite + React：可行，但 Next.js 提供更完整的專案結構

### Decision 3: 後端框架 — Python FastAPI

**選擇**: FastAPI + Python 3.11+

**理由**:
- Python 擁有最成熟的 OCR/影像辨識生態系（PaddleOCR、EasyOCR、Tesseract、OpenCV）
- FastAPI 效能佳、自動產生 OpenAPI 文件、async 支援
- 本次僅建立骨架（健康檢查端點 + 專案結構），不增加不必要的複雜度
- 未來 OCR 端點：`POST /api/ocr/promissory-note` 接收圖片，回傳結構化本票資料

**替代方案**:
- Flask：可行但缺少自動文件產生與 async 支援
- Django：過重，不適合輕量 API 服務

**本次實作範圍**:
```python
# backend/app/main.py — 骨架
GET  /health              ← 健康檢查
# 未來擴充:
# POST /api/ocr/promissory-note  ← 圖片辨識自動填入
```

### Decision 4: PDF 產生 — 瀏覽器端 html2pdf.js (jsPDF + html2canvas)

**選擇**: 使用 html2pdf.js 將預覽 HTML 直接轉換為 PDF

**理由**:
- 預覽畫面即為最終 PDF 內容，直接從 DOM 轉換可確保「所見即所得」
- html2pdf.js 封裝了 jsPDF + html2canvas，API 簡潔
- 純前端執行，不需傳送資料至後端
- 自動處理繁體中文（因為是從渲染後的 DOM 截圖轉換）
- 支援 A4 頁面設定與自動分頁

**替代方案**:
- jsPDF 直接繪製文字：需手動處理中文字型嵌入、排版、換行，工程量大
- @react-pdf/renderer：中文字型支援需額外設定
- 後端 Puppeteer/Playwright：可行但增加後端複雜度，目前不需要

**風險**: html2canvas 轉換偶爾有渲染差異 → 使用固定寬度容器 + 系統字型降低風險

### Decision 5: 表單狀態管理 — React Hook Form + Zod

**選擇**: React Hook Form 管理表單狀態，Zod 定義驗證 schema

**理由**:
- React Hook Form 效能佳（非受控元件），適合大量欄位的表單
- Zod schema 可同時用於 TypeScript 型別推導與執行期驗證
- 支援動態陣列欄位（`useFieldArray`），適用於多張本票的新增/刪除
- 錯誤訊息可完全客製化為繁體中文

**替代方案**:
- Formik：較重，效能略遜
- 手寫 useState：欄位多時難以維護

### Decision 6: 應用程式流程 — 三步驟

**選擇**: 表單 → 預覽 → 下載，以 React state 控制步驟切換

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   表單填寫   │────→│   預覽聲請狀  │────→│  下載 PDF   │
│  (Form)     │←────│  (Preview)  │     │  (Download) │
└─────────────┘     └─────────────┘     └─────────────┘
    驗證通過          返回修改             html2pdf.js
```

**理由**:
- 單頁應用程式，步驟間切換不需路由跳轉
- 表單資料以 React state 保存，返回編輯時資料不會遺失
- 預覽畫面同時作為 PDF 的內容來源

### Decision 7: 台灣在地化工具函式

自建輕量工具函式，不引入額外套件：

| 功能 | 實作方式 |
|------|---------|
| 身分證字號驗證 | 自建函式，實作加權驗證演算法 |
| 金額中文大寫 | 自建函式，對照表轉換（零壹貳參肆伍陸柒捌玖 + 拾佰仟萬億） |
| 民國紀年轉換 | 西元年份 - 1911 |
| 管轄法院選單 | 靜態列表（全台各地方法院） |

**理由**: 邏輯簡單且穩定，無需依賴外部套件，減少 bundle size

### Decision 8: 前後端通訊與 CORS

**選擇**: 前端透過環境變數設定後端 API base URL，開發時後端啟用 CORS 允許 localhost

**理由**:
- 目前前端不呼叫後端（PDF 純前端產生），但預先設定好通訊架構
- 未來 OCR 功能：前端上傳圖片 → 後端辨識 → 回傳 JSON → 前端自動填入表單
- 開發時 Next.js 跑 localhost:3000，FastAPI 跑 localhost:8000

## Risks / Trade-offs

- **html2canvas 渲染精確度** → 使用固定版面寬度、避免複雜 CSS（如 grid），測試多種瀏覽器
- **中文字型在 PDF 中的表現** → html2pdf.js 是從 canvas 轉換，字型由瀏覽器渲染；需設定較高 DPI（如 2x）確保列印品質
- **大量本票時 PDF 分頁** → html2pdf.js 的 `pagebreak` 選項需測試多頁場景
- **後端目前閒置** → 本次後端僅為骨架，增加少量維運成本但確保未來 OCR 擴充順暢
- **Monorepo 部署** → 前後端需分開部署（如 Vercel + Railway/Fly.io），需設定 CI/CD
