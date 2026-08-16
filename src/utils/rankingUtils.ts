import type { Live } from "../types/index.ts";

export interface RankingItem {
  song: string;
  count: number;
  rank: number;
}

/**
 * 公演データの配列から、楽曲ごとの披露回数ランキングを生成する関数
 */
export const getSongRanking = (lives: Live[]): RankingItem[] => {
  const counts: Record<string, number> = {};

  // 1つのセットリスト文字列から曲名を抽出してカウントする内部関数
  const countSongs = (setlist: string | undefined) => {
    if (!setlist) return;
    setlist.split("|").forEach((track) => {
      track.split("//").forEach((songStr) => {
        const title = songStr.split("@")[0].trim();
        if (title) {
          counts[title] = (counts[title] || 0) + 1;
        }
      });
    });
  };

  // 渡された全公演のメインとアンコールを集計
  lives.forEach((live) => {
    countSongs(live.setlist_main);
    countSongs(live.setlist_encore);
  });

  // 配列に変換して降順にソート
  const sortedRanking = Object.entries(counts)
    .map(([song, count]) => ({ song, count }))
    .sort((a, b) => b.count - a.count);

  // 同率順位の計算 (1位, 2位, 2位, 4位...)
  let currentRank = 1;
  let previousCount = -1;

  return sortedRanking.map((item, index) => {
    if (item.count !== previousCount) {
      currentRank = index + 1;
    }
    previousCount = item.count;
    return { ...item, rank: currentRank };
  });
};
