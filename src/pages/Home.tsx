import { useMemo, useEffect } from "react";
import { useLives } from "../hooks/useLives.ts";
import { useMembers } from "../hooks/useMembers.ts";
import { useLiveSearch } from "../hooks/useLiveSearch.ts"; // ← 作成したフックをインポート
import { getSongRanking } from "../utils/rankingUtils.ts";
import SearchForm from "../components/SearchForm.tsx";
import LiveList from "../components/LiveList.tsx";

const Home = () => {
  useEffect(() => {
    document.title = "セットリスト検索";
  }, []);

  const { lives, loading } = useLives();
  const { members: memberColors } = useMembers();
  const { query, setQuery, uniqueYears, uniquePrefectures, uniqueCountries, uniqueVenues, filteredLives } = useLiveSearch(lives, memberColors);

  const members = memberColors.map((m) => m.name);

  // 全曲の披露回数を集計してランキング配列を作成 (サジェスト用)
  const songRanking = useMemo(() => {
    return getSongRanking(lives);
  }, [lives]);

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>読み込み中...</div>;

  return (
    <div>
      <SearchForm
        query={query}
        setQuery={setQuery}
        uniqueYears={uniqueYears}
        members={members}
        memberColors={memberColors}
        uniquePrefectures={uniquePrefectures}
        uniqueCountries={uniqueCountries}
        uniqueVenues={uniqueVenues}
        songRanking={songRanking}
      />

      {/* 検索結果の表示 */}
      <LiveList lives={filteredLives} />
    </div>
  );
};

export default Home;
