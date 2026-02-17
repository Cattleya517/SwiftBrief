import os
from typing import Optional

import instructor
from openai import OpenAI
from pydantic import BaseModel, Field

PROMPT = """\
你是一個台灣本票（promissory note）資料提取助手。
以下是從本票照片 OCR 辨識出的文字，請從中提取結構化資料。

規則：
1. 日期：若為民國年（如「113年6月1日」），轉換為西元（2024-06-01），格式 YYYY-MM-DD
2. 金額：若為中文大寫（如「伍拾萬元整」），轉換為阿拉伯數字（500000），型別為 number
3. 僅回傳能從文字中辨識到的欄位，未偵測到的欄位設為 null

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


class OCRResult(BaseModel):
    note: NoteResult = Field(default_factory=NoteResult)
    respondent: RespondentResult = Field(default_factory=RespondentResult)


def parse_ocr_text(raw_text: str) -> OCRResult:
    client = instructor.from_openai(
        OpenAI(base_url=OLLAMA_BASE_URL, api_key="ollama"),
        mode=instructor.Mode.JSON,
    )

    try:
        return client.chat.completions.create(
            model=OLLAMA_MODEL,
            response_model=OCRResult,
            messages=[{"role": "user", "content": PROMPT + raw_text}],
        )
    except Exception as e:
        raise LLMError(f"LLM 解析失敗: {e}")
