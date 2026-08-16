import type { Member } from "../types/index.ts";

// 背景色を取得する関数
export const getCardBackground = (memberIdStr: string | undefined, members: Member[]) => {
  if (!memberIdStr) return "#ffffff";

  const bgColors = memberIdStr.split("").map((id) => {
    const match = members.find((m) => m.id === id);
    return match ? match.bgColor : "#ffffff";
  });

  if (bgColors.length === 0) return "#ffffff";
  if (bgColors.length === 1) return bgColors[0];

  return `linear-gradient(135deg, ${bgColors.join(", ")})`;
};

// アイコンの色を取得する関数
export const getIconColor = (memberIdStr: string | undefined, members: Member[]) => {
  if (!memberIdStr) return "var(--text-main)";

  const ids = memberIdStr.split("");
  if (ids.length === 1) {
    const match = members.find((m) => m.id === ids[0]);
    return match ? match.color : "var(--text-main)";
  }
  return "var(--text-main)";
};
