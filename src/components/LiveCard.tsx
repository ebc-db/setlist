import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FaCalendarDay } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import type { Live, Member, TagColor } from "../types/index.ts";
import { formatDate } from "../utils/dateUtils.ts";
import { getCardBackground } from "../utils/colorUtils.ts";
import TagBadgeList from "./TagBadgeList.tsx";

interface LiveCardProps {
  live: Live;
  memberColors: Member[];
  tagColors: TagColor[];
}

const LiveCard: React.FC<LiveCardProps> = memo(({ live, memberColors, tagColors }) => {
  const hasLocation = live.venue || live.prefecture;

  // メンバー名を描画する関数（LiveListから移動）
  const renderMemberNames = (memberIdStr: string | undefined) => {
    if (!memberIdStr) return null;
    const ids = memberIdStr.split("");
    return ids.map((id, index) => {
      const match = memberColors.find((m) => m.id === id);
      if (!match) return null;
      return (
        <React.Fragment key={index}>
          {index > 0 && <span style={{ color: "var(--text-sub)", margin: "0 2px" }}>・</span>}
          <span style={{ color: match.color, fontWeight: "bold" }}>{match.name}</span>
        </React.Fragment>
      );
    });
  };

  return (
    <li>
      <Link to={`/live/${live.id}`} className="live-card" style={{ background: getCardBackground(live.member_id, memberColors) }}>
        <div className="live-card-member">{renderMemberNames(live.member_id)}</div>
        <h4 className="live-card-title">{live.title}</h4>
        <div className="live-card-meta">
          <span>
            <FaCalendarDay /> {formatDate(live.date)}
          </span>
          {hasLocation && (
            <span>
              <FaLocationDot /> {live.venue && live.prefecture ? `${live.venue} (${live.prefecture})` : live.venue || live.prefecture}
            </span>
          )}
          {live.tags && <TagBadgeList tagsStr={live.tags} tagColors={tagColors} />}
        </div>
      </Link>
    </li>
  );
});

export default LiveCard;
