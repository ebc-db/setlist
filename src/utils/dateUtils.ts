// 日付を「yyyy/mm/dd (曜日)」に変換する関数
export const formatDate = (dateStr: string | undefined) => {
  if (!dateStr || dateStr === "-") return dateStr || "";
  const d = new Date(dateStr.replace(/-/g, "/"));
  if (isNaN(d.getTime())) return dateStr;

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  return `${y}/${m}/${day} (${days[d.getDay()]})`;
};

// 現在から何日前かを計算する関数
export const getTimeAgo = (dateStr: string | undefined) => {
  if (!dateStr || dateStr === "-") return "";
  const target = new Date(dateStr.replace(/-/g, "/"));
  if (isNaN(target.getTime())) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "（今日）";
  if (diffDays < 0) return `（${Math.abs(diffDays)}日後）`;

  // 1年未満の場合は「〇日前」
  if (diffDays < 365) {
    return `（${diffDays}日前）`;
  }

  // 1年以上の場合は「〇年〇日前」（うるう年を考慮）
  let years = today.getFullYear() - target.getFullYear();
  let anniversary = new Date(target.getFullYear() + years, target.getMonth(), target.getDate());

  if (today.getTime() < anniversary.getTime()) {
    years--;
    anniversary = new Date(target.getFullYear() + years, target.getMonth(), target.getDate());
  }

  const remainingTime = today.getTime() - anniversary.getTime();
  const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

  if (remainingDays === 0) {
    return `（${years}年前）`;
  }
  return `（${years}年${remainingDays}日前）`;
};
