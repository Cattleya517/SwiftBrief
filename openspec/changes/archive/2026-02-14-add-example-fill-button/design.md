## Context

`page.tsx` 中的 `useForm` hook 已提供 `reset()` 方法，可一次性將所有欄位設為指定值。目前未被解構使用。`watch()` 已在使用中，`reset()` 後預覽會自動更新。

表單結構（`PetitionFormData`）包含：applicant、respondent（各有 name、idNumber、address）、claim（amount、interestStartDate、interestRate）、factsAndReasons（4 個欄位）、notes 陣列、court。

idNumber 欄位有 Taiwan ID 驗證（checksum 驗證），範例資料必須使用有效的 ID。

## Goals / Non-Goals

**Goals:**
- 一鍵填入所有必填欄位的有效範例資料
- 按鈕放在表單上方，視覺上明顯但不干擾填寫

**Non-Goals:**
- 不做多組範例資料切換
- 不做「清除」按鈕（使用者可手動清除或重新整理頁面）

## Decisions

### Decision 1: 在 page.tsx 直接實作

按鈕和範例資料定義在 `page.tsx` 中，因為：
- `reset()` 方法來自 `useForm` hook，在 `page.tsx` 中可直接存取
- 範例資料是 `PetitionFormData` 型別的常數，與 schema 同層級
- 不需要建立新元件，一個按鈕加一個常數即可

### Decision 2: 使用 `reset()` 而非 `setValue()`

`reset()` 一次設定所有欄位且重設表單狀態（dirty、touched 等），比逐欄呼叫 `setValue()` 簡潔。

### Decision 3: 按鈕放在 PetitionForm 上方

在左側面板中，`<PetitionForm>` 之前放置按鈕。使用淺色/次要按鈕樣式，避免與「下載 PDF」主按鈕混淆。

## Risks / Trade-offs

- **範例資料過時**: 如果表單 schema 新增必填欄位，範例資料需同步更新。由於範例資料是 `PetitionFormData` 型別，TypeScript 會在缺少欄位時報錯。
