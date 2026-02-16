"use client";

import { RefObject } from "react";
import { PetitionFormData } from "@/lib/schema";
import { amountToChinese } from "@/lib/amount-to-chinese";
import { toMinguoDate, getTodayMinguo } from "@/lib/date-utils";

interface Props {
  data: PetitionFormData;
  previewRef: RefObject<HTMLDivElement | null>;
}

const P = (value: string | undefined) => value || "＿＿＿";
const PDate = (value: string | undefined) =>
  value ? toMinguoDate(value) : "民國＿年＿月＿日";
const PAmount = (value: number | undefined) =>
  value && value > 0 ? amountToChinese(value) : "＿＿＿";
const PAmountNum = (value: number | undefined) =>
  value && value > 0 ? value.toLocaleString() : "＿＿＿";

export default function PetitionPreview({ data, previewRef }: Props) {
  const totalAmount = data.notes.reduce((sum, n) => sum + (n.amount || 0), 0);

  const generateInterestClause = () => {
    const { interestType, interestStartPoint, interestRate, customInterestDate } =
      data.claim;

    // Legacy fallback
    if (!interestType && data.claim.interestStartDate) {
      const rate = data.claim.interestRate || 6;
      return `，並自${PDate(data.claim.interestStartDate)}起至清償日止，按年利率百分之${rate}計算之利息`;
    }

    let rateText = "年利率百分之六";
    if (interestType === "agreed" && interestRate) {
      rateText = `約定年利率百分之${interestRate}`;
    }

    let startDateText = "";

    if (interestType === "statutory") {
      if (interestStartPoint === "maturity_date") {
        // Ideally use specific date if single note or if they all match. 
        // For now, if "maturity_date" is selected, it usually implies the *concept* or the specific date if we can resolve it.
        // Common phrasing: "到期日" or "自民國xxx年xx月xx日(到期日)"
        // Let's use specific date if single note has it.
        if (data.notes.length === 1 && data.notes[0].dueDate) {
          startDateText = PDate(data.notes[0].dueDate);
        } else {
          startDateText = "到期日";
        }
      } else if (interestStartPoint === "presentation_date") {
        if (data.factsAndReasons.presentmentDate) {
          startDateText = PDate(data.factsAndReasons.presentmentDate);
        } else {
          startDateText = "提示日";
        }
      }
    } else if (interestType === "agreed") {
      if (interestStartPoint === "invoice_date") {
        if (data.notes.length === 1 && data.notes[0].issueDate) {
          startDateText = PDate(data.notes[0].issueDate);
        } else {
          startDateText = "發票日";
        }
      } else if (interestStartPoint === "custom_date" && customInterestDate) {
        startDateText = PDate(customInterestDate);
      }
    }

    if (!startDateText) return "";

    return `，並自${startDateText}起至清償日止，按${rateText}計算之利息`;
  };

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
      <div
        ref={previewRef}
        className="p-12 text-black leading-8"
        style={{ fontFamily: "serif", fontSize: "16px" }}
      >
        {/* Title */}
        <h1 className="text-center text-2xl font-bold tracking-widest mb-2">
          民事聲請狀
        </h1>

        {/* Case type */}
        <div className="mb-6">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-20 align-top">案由：</td>
                <td>本票裁定</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Parties */}
        <div className="mb-6">
          <div className="mb-4">
            <div className="flex">
              <span className="w-20 shrink-0">聲請人：</span>
              <span>{P(data.applicant.name)}</span>
            </div>
            <div className="flex ml-20">
              <span className="w-28 shrink-0">身分證字號：</span>
              <span>{P(data.applicant.idNumber)}</span>
            </div>
            <div className="flex ml-20">
              <span className="w-28 shrink-0">住址：</span>
              <span>{P(data.applicant.address)}</span>
            </div>
          </div>

          <div>
            <div className="flex">
              <span className="w-20 shrink-0">相對人：</span>
              <span>{P(data.respondent.name)}</span>
            </div>
            <div className="flex ml-20">
              <span className="w-28 shrink-0">身分證字號：</span>
              <span>{P(data.respondent.idNumber)}</span>
            </div>
            <div className="flex ml-20">
              <span className="w-28 shrink-0">住址：</span>
              <span>{P(data.respondent.address)}</span>
            </div>
          </div>
        </div>

        {/* Court */}
        <div className="text-center mb-4">
          <p className="text-lg font-semibold">
            {P(data.court)}　公鑒
          </p>
        </div>

        {/* Purpose */}
        <div className="mb-6">
          <p className="indent-8">
            為本票裁定事件，謹依非訟事件法第194條規定，聲請裁定准予強制執行事。
          </p>
        </div>

        {/* Declaration */}
        <div className="mb-6">
          <p className="font-bold mb-2">壹、聲明：</p>
          <p className="indent-8">
            相對人於{PDate(data.notes[0]?.issueDate)}
            簽發之本票，內載憑票交付聲請人新台幣
            {PAmountNum(totalAmount)}元（新台幣{PAmount(totalAmount)}）
            {generateInterestClause()}
            ，准予強制執行。
          </p>
        </div>

        {/* Facts and Reasons */}
        <div className="mb-6">
          <p className="font-bold mb-2">貳、事實及理由：</p>
          <p className="indent-8">
            緣相對人{P(data.respondent.name)}於
            {PDate(data.factsAndReasons.acquisitionDate)}
            因{P(data.factsAndReasons.acquisitionReason)}
            關係，簽發如附表所示之本票
            {data.notes.length > 1
              ? `共${data.notes.length}紙`
              : "乙紙"}
            ，面額合計新台幣{PAmount(totalAmount)}
            （NT${PAmountNum(totalAmount)}），交付聲請人收執。
          </p>
          <p className="indent-8 mt-2">
            詎料，上開本票届期後，經聲請人於
            {PDate(data.factsAndReasons.presentmentDate)}
            向相對人提示請求付款，
            {P(data.factsAndReasons.refusalDescription)}
            。爰依票據法第123條及非訟事件法第194條之規定，聲請鈞院裁定准予強制執行。
          </p>
        </div>

        {/* Note details table */}
        <div className="mb-6">
          <p className="font-bold mb-2">參、本票明細表：</p>
          <table className="w-full border-collapse border border-black text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2">編號</th>
                <th className="border border-black px-3 py-2">票號</th>
                <th className="border border-black px-3 py-2">發票日</th>
                <th className="border border-black px-3 py-2">付款地</th>
                <th className="border border-black px-3 py-2">到期日</th>
                <th className="border border-black px-3 py-2">
                  金額（新台幣）
                </th>
              </tr>
            </thead>
            <tbody>
              {data.notes.map((note, i) => (
                <tr key={i}>
                  <td className="border border-black px-3 py-2">{i + 1}</td>
                  <td className="border border-black px-3 py-2">
                    {P(note.noteNumber)}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {PDate(note.issueDate)}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {P(note.paymentPlace)}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {note.dueDate
                      ? toMinguoDate(note.dueDate)
                      : "未載到期日（見票即付）"}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {PAmountNum(note.amount)}
                  </td>
                </tr>
              ))}
              {data.notes.length > 1 && (
                <tr className="font-bold">
                  <td
                    colSpan={5}
                    className="border border-black px-3 py-2 text-right"
                  >
                    合計
                  </td>
                  <td className="border border-black px-3 py-2">
                    {PAmountNum(totalAmount)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Attachments */}
        <div className="mb-6">
          <p className="font-bold mb-2">肆、附件：</p>
          <p className="indent-8">
            一、本票正本（或影本）{data.notes.length}紙。
          </p>
          <p className="indent-8">二、聲請人國民身分證影本乙份。</p>
          <p className="indent-8">三、相對人戶籍謄本乙份。</p>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <p className="text-center mb-8">謹　狀</p>

          <div className="text-right">
            <p className="mb-8">
              具狀人（聲請人）：{P(data.applicant.name)}　（簽章）
            </p>
            <p>{getTodayMinguo()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
