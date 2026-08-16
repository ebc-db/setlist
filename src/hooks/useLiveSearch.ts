import { useMemo } from "react";
import type { Live, Member } from "../types/index.ts";
import { PREFECTURES } from "../constants/index.ts";
import { useSearchContext } from "../context/SearchContext.tsx";

export const useLiveSearch = (lives: Live[], memberColors: Member[]) => {
  // 検索条件のステート
  const { query, setQuery } = useSearchContext();

  // 存在する年を抽出
  const uniqueYears = useMemo(() => {
    return Array.from(new Set(lives.map((l) => (l.date ? l.date.substring(0, 4) : ""))))
      .filter(Boolean)
      .sort()
      .reverse();
  }, [lives]);

  // 存在する都道府県を抽出（JIS順 + 配信・海外）
  const uniquePrefectures = useMemo(() => {
    const rawPrefs = Array.from(new Set(lives.map((l) => l.prefecture))).filter(Boolean);
    const existingJisPrefs = PREFECTURES.filter((p) => rawPrefs.includes(p));
    return ["配信", "海外", ...existingJisPrefs];
  }, [lives]);

  // 存在する国を抽出
  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(lives.map((l) => l.prefecture)))
      .filter((p) => p && p !== "配信" && !PREFECTURES.includes(p))
      .sort();
  }, [lives]);

  // 存在する会場を抽出（選択中の都道府県/国に連動）
  const uniqueVenues = useMemo(() => {
    let targetLives = lives;
    if (query.prefecture === "海外") {
      if (query.country) {
        targetLives = lives.filter((l) => l.prefecture === query.country);
      } else {
        targetLives = lives.filter((l) => l.prefecture && l.prefecture !== "配信" && !PREFECTURES.includes(l.prefecture));
      }
    } else if (query.prefecture) {
      targetLives = lives.filter((l) => l.prefecture === query.prefecture);
    }
    return Array.from(new Set(targetLives.map((l) => l.venue)))
      .filter(Boolean)
      .sort();
  }, [lives, query.prefecture, query.country]);

  // 検索条件による絞り込み実行
  const filteredLives = useMemo(() => {
    return lives.filter((live) => {
      if (!live || !live.id) return false;

      const matchSong =
        !query.song ||
        query.song
          .trim()
          .toLowerCase()
          .split(/[\s ]+/)
          .every((keyword) => (live.setlist_main?.toLowerCase() || "").includes(keyword) || (live.setlist_encore?.toLowerCase() || "").includes(keyword));
      const matchYear = !query.year || (live.date && live.date.startsWith(query.year));
      const matchVenue = !query.venue || live.venue === query.venue;

      let matchPrefecture = true;
      if (query.prefecture === "海外") {
        if (query.country) {
          matchPrefecture = live.prefecture === query.country;
        } else {
          matchPrefecture = !!live.prefecture && live.prefecture !== "配信" && !PREFECTURES.includes(live.prefecture);
        }
      } else if (query.prefecture) {
        matchPrefecture = live.prefecture === query.prefecture;
      }

      const matchMember =
        query.members.length === 0 ||
        query.members.every((selectedName) => {
          const targetMember = memberColors.find((m) => m.name === selectedName);
          if (!targetMember) return false;
          const targetId = targetMember.id;
          if (targetId === "0") return live.member_id === "0";
          return live.member_id && live.member_id.includes(targetId);
        });

      const matchTag = query.tags.length === 0 || query.tags.every((tag) => live.tags?.split("|").includes(tag));

      return matchSong && matchYear && matchVenue && matchPrefecture && matchMember && matchTag;
    });
  }, [lives, query, memberColors]);

  // コンポーネント側で使いたい値と関数だけを返す
  return {
    query,
    setQuery,
    uniqueYears,
    uniquePrefectures,
    uniqueCountries,
    uniqueVenues,
    filteredLives,
  };
};
