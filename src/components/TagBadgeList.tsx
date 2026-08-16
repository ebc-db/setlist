import React from "react";
import { FaTags } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import type { TagColor } from "../types/index.ts";

interface Props {
  tagsStr: string | undefined;
  tagColors: TagColor[];
}

const TagBadgeList: React.FC<Props> = ({ tagsStr, tagColors }) => {
  const navigate = useNavigate();

  if (!tagsStr) return null;

  // タグがクリックされた時の処理
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault(); // 親要素（LiveListのカード全体リンク）への遷移を防ぐ
    navigate(`/tag/${encodeURIComponent(tag.trim())}`);
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
      <FaTags style={{ color: "var(--text-sub)" }} />
      {tagsStr.split("|").map((tag) => {
        const tagInfo = tagColors.find((t) => t.tag?.trim() === tag.trim());
        const bgColor = tagInfo ? tagInfo.bgColor : "#e9ecef";

        return (
          <span
            key={tag}
            className="tag-badge"
            onClick={(e) => handleTagClick(e, tag)}
            style={{
              backgroundColor: bgColor,
            }}
          >
            {tag}
          </span>
        );
      })}
    </span>
  );
};

export default TagBadgeList;
