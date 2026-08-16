import React, { useState, useMemo, useEffect } from "react";
import type { Live } from "../types/index.ts";
import { BiSortAlt2 } from "react-icons/bi";
import { useMembers } from "../hooks/useMembers.ts";
import { useTagColors } from "../hooks/useTagColors.ts";
import LiveCard from "./LiveCard.tsx"; // ← 新規インポート

interface LiveListProps {
  lives: Live[];
}

const LiveList: React.FC<LiveListProps> = ({ lives }) => {
  const { members: memberColors } = useMembers();
  const { tags: tagColors } = useTagColors();

  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    setDisplayCount(20);
  }, [lives, sortOrder]);

  const sortedLives = useMemo(() => {
    return [...lives].sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";

      if (sortOrder === "desc") {
        return dateA < dateB ? 1 : -1;
      } else {
        return dateA > dateB ? 1 : -1;
      }
    });
  }, [lives, sortOrder]);

  const displayedLives = sortedLives.slice(0, displayCount);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  if (lives.length === 0) return <p style={{ textAlign: "center", padding: "2rem" }}>該当する公演がありません。</p>;

  return (
    <div>
      <div className="list-header">
        <div className="result-count">検索結果: {lives.length} 件</div>
        <button onClick={toggleSort} className="sort-toggle-btn">
          <BiSortAlt2 size={18} color="var(--primary)" />
          {sortOrder === "desc" ? "新しい順" : "古い順"}
        </button>
      </div>

      <ul className="live-list">
        {displayedLives.map((live) => (
          <LiveCard key={live.id} live={live} memberColors={memberColors} tagColors={tagColors} />
        ))}
      </ul>

      {sortedLives.length > displayCount && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} className="load-more-btn">
            さらに表示する
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveList;
