const DIGITS = ["零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
const UNITS = ["", "拾", "佰", "仟"];
const BIG_UNITS = ["", "萬", "億"];

export function amountToChinese(amount: number): string {
  if (amount <= 0 || !Number.isInteger(amount)) return "";
  if (amount === 0) return "零元整";

  const str = String(amount);
  const len = str.length;

  // Split into groups of 4 from right
  const groups: number[][] = [];
  for (let i = len; i > 0; i -= 4) {
    const start = Math.max(0, i - 4);
    groups.unshift(str.slice(start, i).split("").map(Number));
  }

  let result = "";
  for (let gi = 0; gi < groups.length; gi++) {
    const group = groups[gi];
    const bigUnitIndex = groups.length - 1 - gi;
    let groupStr = "";
    let zeroFlag = false;

    for (let di = 0; di < group.length; di++) {
      const digit = group[di];
      const unitIndex = group.length - 1 - di;

      if (digit === 0) {
        zeroFlag = true;
      } else {
        if (zeroFlag) {
          groupStr += "零";
          zeroFlag = false;
        }
        groupStr += DIGITS[digit] + UNITS[unitIndex];
      }
    }

    if (groupStr) {
      result += groupStr + BIG_UNITS[bigUnitIndex];
    }
  }

  return result + "元整";
}
