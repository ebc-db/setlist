import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLives } from "../hooks/useLives.ts";
import { getSongRanking } from "../utils/rankingUtils.ts";

const Ranking = () => {
  const { lives, loading } = useLives();
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // セレクトボックス用にデータに存在するユニークな年を抽出
  const uniqueYears = useMemo(() => {
    return Array.from(new Set(lives.map((l) => (l.date ? l.date.substring(0, 4) : ""))))
      .filter(Boolean)
      .sort()
      .reverse();
  }, [lives]);

  // ページのタイトルを動的に変更
  useEffect(() => {
    if (selectedYear === "all") {
      document.title = "全期間の披露回数ランキング";
    } else {
      document.title = `${selectedYear}年の披露回数ランキング`;
    }
  }, [selectedYear]);

  // 選択された年でデータを絞り込み、曲ごとのランキングを集計
  const rankingData = useMemo(() => {
    // 年でフィルタリング
    const targetLives = selectedYear === "all" ? lives : lives.filter((l) => l.date && l.date.startsWith(selectedYear));

    // 共通関数を呼び出す
    return getSongRanking(targetLives);
  }, [lives, selectedYear]);

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>読み込み中...</div>;

  return (
    <div>
      <div className="ranking-header">
        <h2 style={{ margin: "0 0 16px 0", fontSize: "1.4rem" }}>{selectedYear === "all" ? "全期間の披露回数ランキング" : `${selectedYear}年の披露回数ランキング`}</h2>
        <select className="year-selector" style={{ width: "fit-content", marginBottom: "16px" }} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="all">全期間</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
      </div>

      {rankingData.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>データがありません。</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="ranking-table">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>順位</th>
                <th style={{ width: "65%" }}>曲名</th>
                <th style={{ width: "20%" }}>回数</th>
              </tr>
            </thead>
            <tbody>
              {rankingData.map((item, idx) => {
                // 1位〜3位の文字色を分ける
                let rankClass = "";
                if (item.rank === 1) rankClass = "rank-1";
                else if (item.rank === 2) rankClass = "rank-2";
                else if (item.rank === 3) rankClass = "rank-3";

                return (
                  <tr key={idx}>
                    <td className={rankClass}>{item.rank}</td>
                    <td>
                      {/* 曲名をクリックしたら楽曲詳細ページへ飛べるように */}
                      <Link to={`/song/${encodeURIComponent(item.song)}`} className="song-link">
                        {item.song}
                      </Link>
                    </td>
                    <td>{item.count} 回</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ranking;
