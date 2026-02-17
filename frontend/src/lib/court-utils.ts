import { PetitionFormData } from "./schema";

export const COURT_MAPPING: Record<string, string> = {
    "臺北": "臺灣臺北地方法院",
    "台北": "臺灣臺北地方法院",
    "士林": "臺灣士林地方法院",
    "新北": "臺灣新北地方法院",
    "板橋": "臺灣新北地方法院",
    "桃園": "臺灣桃園地方法院",
    "新竹": "臺灣新竹地方法院",
    "苗栗": "臺灣苗栗地方法院",
    "臺中": "臺灣臺中地方法院",
    "台中": "臺灣臺中地方法院",
    "南投": "臺灣南投地方法院",
    "彰化": "臺灣彰化地方法院",
    "雲林": "臺灣雲林地方法院",
    "嘉義": "臺灣嘉義地方法院",
    "臺南": "臺灣臺南地方法院",
    "台南": "臺灣臺南地方法院",
    "橋頭": "臺灣橋頭地方法院",
    "高雄": "臺灣高雄地方法院",
    "屏東": "臺灣屏東地方法院",
    "臺東": "臺灣臺東地方法院",
    "台東": "臺灣臺東地方法院",
    "花蓮": "臺灣花蓮地方法院",
    "宜蘭": "臺灣宜蘭地方法院",
    "基隆": "臺灣基隆地方法院",
    "澎湖": "臺灣澎湖地方法院",
    "金門": "福建金門地方法院",
    "連江": "福建連江地方法院",
    "馬祖": "福建連江地方法院",
};

/**
 * Infer court name from an address or city/district string
 */
export function inferCourt(address: string | undefined): string {
    if (!address) return "";

    for (const [key, value] of Object.entries(COURT_MAPPING)) {
        if (address.includes(key)) {
            return value;
        }
    }

    return "";
}

/**
 * Get the address for jurisdiction based on priority:
 * 1. Place of Payment (from any note)
 * 2. Place of Issue (from any note)
 * 3. Respondent's residence
 */
export function getJurisdictionAddress(data: PetitionFormData): string {
    // 1. Check all notes for paymentPlace
    for (const note of data.notes) {
        if (note.paymentPlace) return note.paymentPlace;
    }

    // 2. Check all notes for issuePlace
    for (const note of data.notes) {
        if (note.issuePlace) return note.issuePlace;
    }

    // 3. Fallback to respondent address
    return data.respondent.address || "";
}

/**
 * Automatically determine the court name based on form data
 */
export function autoDetermineCourt(data: PetitionFormData): string {
    const address = getJurisdictionAddress(data);
    return inferCourt(address);
}
