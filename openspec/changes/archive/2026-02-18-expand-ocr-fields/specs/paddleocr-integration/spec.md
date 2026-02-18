## MODIFIED Requirements

### Requirement: OCR result extracts all identifiable fields from promissory note

系統 SHALL 從本票 OCR 文字中提取以下所有可辨識的欄位：

**note**: noteNumber, issueDate, dueDate, amount, paymentPlace, issuePlace
**respondent**: name, idNumber, address
**applicant**: name（從「支付___」或「受款人」提取）
**claim**: interestRate（從「按年利率百分之___」提取）, interestStartPoint（從「自發票日起/自到期日起/自提示日起」映射為 enum）

#### Scenario: Extract applicant name from payee clause

- **WHEN** OCR 文字包含「無條件擔任支付王小明」
- **THEN** 回傳 `applicant.name = "王小明"`

#### Scenario: Extract interest rate

- **WHEN** OCR 文字包含「按年利率百分之六計算利息」
- **THEN** 回傳 `claim.interestRate = 6`

#### Scenario: Extract interest start point from invoice date

- **WHEN** OCR 文字包含「自發票日起」
- **THEN** 回傳 `claim.interestStartPoint = "invoice_date"`

#### Scenario: Fields not found remain absent

- **WHEN** OCR 文字中沒有受款人資訊
- **THEN** response 中不包含 `applicant` 物件
