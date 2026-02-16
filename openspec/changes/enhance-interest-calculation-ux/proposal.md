<artifact id="proposal" change="enhance-interest-calculation-ux" schema="spec-driven">

# 提案：優化利息計算 UX 與邏輯

## 為什麼 (Why)
使用者目前在理解「請求標的」區塊時感到困難，且現有的利息計算選項不足以涵蓋各種法律情境。

為了提升易用性並符合法律規範，我們需要：
1.  **降低認知負擔**：在請求標的後方以括號顯示請求金額。
2.  **擴充利息計算選項**：涵蓋「約定利息」與「未約定利息」情境，並包含有無到期日對利息起算日的不同規則。

## 功能 (Capabilities)

### 新增功能 (New Capabilities)
- `interest-calculation-logic`：實作 4 種不同的利息計算情境（約定 vs 法定，以及不同的起算日規則）。
- `request-target-display`：格式化請求標的區塊，將金額顯示於括號內。

### 修改功能 (Modified Capabilities)
- `form-schema`：更新資料模型以支援新的利息計算輸入（約定利率、約定日期、有無到期日）。

## 影響範圍 (Impact)
- **前端 (Frontend)**：
    - 更新請求標的的視覺顯示。
    - 更新利息區塊表單介面，支援依據情境條件顯示不同欄位的 4 種情境。
- **後端/邏輯 (Backend/Logic)**：
    - 更新生成邏輯 (Prompt Generation)，依據選定的情境包含正確的利息細節。

## 驗收標準 (Success Criteria)
1.  請求標的需以括號顯示金額。
2.  使用者可以選擇「約定利息」與「未約定利息」。
3.  「約定利息」需允許輸入利率，並可選擇「發票日」或「約定日」作為起算日。
4.  「未約定利息」需預設為 6% 法定利率。
5.  「未約定利息」的起算日邏輯需能依據輸入（有無到期日）正確切換為「到期日」或「提示日」。

<unlocks>
Completing this artifact enables: design, specs
</unlocks>

</artifact>
