import os
from typing import Optional

import instructor
from openai import OpenAI
from opencc import OpenCC
from pydantic import BaseModel, Field

_s2t = OpenCC("s2t")

PROMPT = """\
你是一個台灣本票（promissory note）資料提取助手。
以下是從本票照片 OCR 辨識出的文字，請從中提取結構化資料。

本票欄位辨識指引：
- noteNumber（票號）：通常在「字第___號」旁邊，或底部的編號如 MB000000001
- dueDate（到期日）：「憑票准於___年___月___日無條件擔任兌付」中的日期，這是到期日不是發票日
- issueDate（發票日）：本票最下方「中華民國___年___月___日」，這是發票日
- amount（金額）：「新台幣___元整」或「NT$___元」中的金額
- paymentPlace（付款地）：「付款地：」後面的地址
- issuePlace（發票地）：「發票地：」後面的地址
- respondent.name（發票人姓名）：「發票人：」或「發票人」後面的姓名
- respondent.idNumber（身分證字號）：「身分證統一編號：」後面的號碼
- respondent.address（發票人地址）：發票人區塊中「地址：」後面的內容
- applicant.name（受款人/聲請人姓名）：「無條件擔任支付___」或「支付___或其指定人」中的人名
- claim.interestRate（年利率）：「按年利率百分之___」中的數字
- claim.interestStartPoint（利息起算方式）：
  - 「自發票日起」→ "invoice_date"
  - 「自到期日起」→ "maturity_date"
  - 「自提示日起」→ "presentation_date"

規則：
1. 日期：民國年轉西元（民國年 + 1911 = 西元年），格式 YYYY-MM-DD。例：民國111年 = 2022年，民國120年 = 2031年
2. 金額：中文大寫轉阿拉伯數字（如「伍拾萬元整」= 500000，「壹佰萬元整」= 1000000），型別為 number
3. 僅回傳能辨識到的欄位，未偵測到的設為 null

OCR 辨識文字：
"""

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434/v1")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen2.5")


class LLMError(Exception):
    pass


class NoteResult(BaseModel):
    noteNumber: Optional[str] = Field(None, description="票號")
    issueDate: Optional[str] = Field(None, description="發票日 YYYY-MM-DD")
    dueDate: Optional[str] = Field(None, description="到期日 YYYY-MM-DD")
    amount: Optional[int] = Field(None, description="金額")
    paymentPlace: Optional[str] = Field(None, description="付款地")
    issuePlace: Optional[str] = Field(None, description="發票地")


class RespondentResult(BaseModel):
    name: Optional[str] = Field(None, description="發票人姓名")
    idNumber: Optional[str] = Field(None, description="身分證字號")
    address: Optional[str] = Field(None, description="地址")


class ApplicantResult(BaseModel):
    name: Optional[str] = Field(None, description="受款人/聲請人姓名")


class ClaimResult(BaseModel):
    interestRate: Optional[int] = Field(None, description="年利率數字")
    interestStartPoint: Optional[str] = Field(None, description="利息起算方式: invoice_date / maturity_date / presentation_date")


class OCRResult(BaseModel):
    note: NoteResult = Field(default_factory=NoteResult)
    respondent: RespondentResult = Field(default_factory=RespondentResult)
    applicant: ApplicantResult = Field(default_factory=ApplicantResult)
    claim: ClaimResult = Field(default_factory=ClaimResult)


def parse_ocr_text(raw_text: str) -> OCRResult:
    client = instructor.from_openai(
        OpenAI(base_url=OLLAMA_BASE_URL, api_key="ollama"),
        mode=instructor.Mode.JSON,
    )

    try:
        result = client.chat.completions.create(
            model=OLLAMA_MODEL,
            response_model=OCRResult,
            messages=[{"role": "user", "content": PROMPT + raw_text}],
        )
    except Exception as e:
        raise LLMError(f"LLM 解析失敗: {e}")

    return _to_traditional(result)


def _to_traditional(result: OCRResult) -> OCRResult:
    """將所有文字欄位從簡體轉為繁體中文。"""
    for sub_model in [result.note, result.respondent, result.applicant, result.claim]:
        for field_name, value in sub_model:
            if isinstance(value, str) and field_name != "interestStartPoint":
                setattr(sub_model, field_name, _s2t.convert(value))
    return result
