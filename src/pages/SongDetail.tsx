import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useLives } from "../hooks/useLives.ts";
import LiveList from "../components/LiveList.tsx";
import { formatDate, getTimeAgo } from "../utils/dateUtils.ts";
import { isExactMatch, countExactMatch } from "../utils/setlistUtils.ts";
import { IoIosMusicalNotes } from "react-icons/io";
import { getSongRanking } from "../utils/rankingUtils.ts";

const SongDetail = () => {
  const { songName } = useParams<{ songName: string }>();
  const { lives, loading } = useLives();
  const decodedSong = decodeURIComponent(songName || "");

  useEffect(() => {
    document.title = `「${decodedSong}」が披露された公演一覧`;
  }, [decodedSong]);

  // その曲が披露された公演のリスト
  const performedLives = useMemo(() => {
    return lives.filter((live) => {
      if (!live || !live.id) return false;
      const matchMain = isExactMatch(live.setlist_main, decodedSong);
      const matchEncore = isExactMatch(live.setlist_encore, decodedSong);
      return matchMain || matchEncore;
    });
  }, [lives, decodedSong]);

  // 統計情報の計算
  const stats = useMemo(() => {
    if (performedLives.length === 0) return null;

    const totalPlays = performedLives.reduce((acc, live) => {
      return acc + countExactMatch(live.setlist_main, decodedSong) + countExactMatch(live.setlist_encore, decodedSong);
    }, 0);

    const sortedDates = performedLives
      .map((live) => live.date)
      .filter(Boolean)
      .sort();

    const allRanking = getSongRanking(lives);
    const rankInfo = allRanking.find((item) => item.song === decodedSong);

    return {
      totalPlays,
      firstDate: sortedDates[0] || "-",
      lastDate: sortedDates[sortedDates.length - 1] || "-",
      rank: rankInfo ? rankInfo.rank : null,
    };
  }, [performedLives, decodedSong, lives]);

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>読み込み中...</div>;

  return (
    <div>
      <div className="detail-header" style={{ padding: "20px", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "24px", background: "var(--bg-card)" }}>
        <h2 className="detail-title">
          <IoIosMusicalNotes /> {decodedSong}
        </h2>

        {/* 統計情報の表示ブロック */}
        {stats && (
          <div className="song-stats">
            <div className="stat-item">
              <span className="stat-label">総披露回数</span>
              <span className="stat-value">{stats.totalPlays} 回</span>
              {stats.rank !== null && <span className="stat-sub">全期間{stats.rank}位</span>}
            </div>
            <div className="stat-item">
              <span className="stat-label">初披露日</span>
              <span className="stat-value">{formatDate(stats.firstDate)}</span>
              {stats.lastDate !== "-" && <span className="stat-sub">{getTimeAgo(stats.firstDate)}</span>}
            </div>
            <div className="stat-item">
              <span className="stat-label">最終披露日</span>
              <span className="stat-value">{formatDate(stats.lastDate)}</span>
              {stats.lastDate !== "-" && <span className="stat-sub">{getTimeAgo(stats.lastDate)}</span>}
            </div>
          </div>
        )}
      </div>

      <LiveList lives={performedLives} />
    </div>
  );
};

export default SongDetail;
