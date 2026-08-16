import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useLives } from "../hooks/useLives.ts";
import LiveList from "../components/LiveList.tsx";
import { FaTags } from "react-icons/fa6";

const TagDetail = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const { lives, loading } = useLives();
  // URLのエンコードを元に戻す
  const decodedTag = decodeURIComponent(tagName || "");

  useEffect(() => {
    document.title = `タグ「${decodedTag}」の公演一覧`;
  }, [decodedTag]);

  // そのタグが含まれる公演のリストを抽出
  const performedLives = useMemo(() => {
    return lives.filter((live) => {
      if (!live || !live.id || !live.tags) return false;
      // 区切り文字で配列にし、前後の空白を除去して一致判定
      const tagsArray = live.tags.split("|").map((t) => t.trim());
      return tagsArray.includes(decodedTag);
    });
  }, [lives, decodedTag]);

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>読み込み中...</div>;

  return (
    <div>
      <div className="detail-header" style={{ padding: "20px", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "24px", background: "var(--bg-card)" }}>
        <h2 className="detail-title">
          <FaTags style={{ marginRight: "8px", color: "var(--text-sub)" }} />
          タグ「{decodedTag}」の公演一覧
        </h2>
      </div>

      {/* 絞り込んだ公演をリスト表示 */}
      <LiveList lives={performedLives} />
    </div>
  );
};

export default TagDetail;
