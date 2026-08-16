import { useParams, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useLives } from "../hooks/useLives.ts";
import { useMembers } from "../hooks/useMembers.ts";
import { FaCalendarDay } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import LiveList from "../components/LiveList.tsx";
import { formatDate } from "../utils/dateUtils.ts";
import { parseTrack } from "../utils/setlistUtils.ts";
import { getCardBackground, getIconColor } from "../utils/colorUtils.ts";
import TagBadgeList from "../components/TagBadgeList.tsx";
import { useTagColors } from "../hooks/useTagColors.ts";

const LiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lives, loading } = useLives();
  const { members: memberColors } = useMembers();
  const { tags: tagColors } = useTagColors();

  const live = lives.find((l) => l.id === id);

  // タイトル設定
  useEffect(() => {
    if (live) {
      document.title = `${live.title}のセットリスト`;
    } else if (!loading) {
      document.title = "公演が見つかりませんでした"; // エラー時のフォールバック
    }
  }, [live, loading]);

  // メンバー名を色付きで表示する関数
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

  // 注釈内のメンバー名を検出し、色付きの要素に変換する関数
  const renderAnnotatedNote = (note: string) => {
    if (!note) return null;

    // "真山りか|安本彩花|..." のような正規表現を作成
    const memberNames = memberColors.map((m) => m.name).filter(Boolean);
    if (memberNames.length === 0) return note;

    const regex = new RegExp(`(${memberNames.join("|")})`, "g");
    const parts = note.split(regex);

    return parts.map((part, index) => {
      const member = memberColors.find((m) => m.name === part);
      // メンバー名と一致した部分は色付きの <span> で返す
      if (member) {
        return (
          <span key={index} style={{ color: member.color, fontWeight: "bold" }}>
            {part}
          </span>
        );
      }
      // それ以外の通常のテキストはそのまま返す
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>読み込み中...</div>;
  if (!live) return <div style={{ textAlign: "center", padding: "2rem" }}>公演が見つかりませんでした。</div>;

  const mainTracks = live.setlist_main ? live.setlist_main.split("|") : [];
  const encoreTracks = live.setlist_encore ? live.setlist_encore.split("|") : [];
  const relatedLives = lives.filter((l) => l.title === live.title && l.id !== live.id);

  // セットリストを描画する共通関数
  const renderSetlist = (tracks: string[], prefix: "M" | "En") => (
    <ul className="setlist">
      {tracks.map((trackStr, idx) => {
        const { isMedley, songs } = parseTrack(trackStr);
        return (
          <li key={idx} className={isMedley ? "medley-track" : ""}>
            {/* 独自の曲番号を表示 */}
            <div className="track-number">
              {prefix}.{idx + 1}
            </div>

            {/* 曲の内容（メドレー表記や曲名・注釈） */}
            <div className="track-content">
              {isMedley && <div className="medley-label">メドレー</div>}
              <div className="track-songs">
                {songs.map((song, sIdx) => (
                  <div key={sIdx} className="song-item">
                    <Link to={`/song/${encodeURIComponent(song.title)}`}>{song.title}</Link>
                    {song.note && <span className="song-note">{renderAnnotatedNote(song.note)}</span>}
                  </div>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      {/* ヘッダー部分にインラインスタイルで背景色を適用 */}
      <div className="detail-header" style={{ background: getCardBackground(live.member_id, memberColors) }}>
        <h2 className="detail-title">{live.title}</h2>
        <p className="detail-member">
          <IoPerson style={{ color: getIconColor(live.member_id, memberColors) }} /> {renderMemberNames(live.member_id)}
        </p>
        <div className="live-card-meta">
          <span>
            <FaCalendarDay /> {formatDate(live.date)}
          </span>
          {/* 会場・都道府県の表示制御（リスト画面と同じ仕様に統一） */}
          {(live.venue || live.prefecture) && (
            <span>
              <FaLocationDot /> {live.venue && live.prefecture ? `${live.venue} (${live.prefecture})` : live.venue || live.prefecture}
            </span>
          )}
        </div>

        {live.tags && (
          <div style={{ marginTop: "12px" }}>
            <TagBadgeList tagsStr={live.tags} tagColors={tagColors} />
          </div>
        )}
      </div>

      <div className="setlist-section">
        <div className="setlist-phase-title">本編</div>
        {renderSetlist(mainTracks, "M")}

        {encoreTracks.length > 0 && (
          <>
            <div className="setlist-phase-title">アンコール</div>
            {renderSetlist(encoreTracks, "En")}
          </>
        )}
      </div>

      {/* 同名公演がある場合のみセクションを表示 */}
      {relatedLives.length > 0 && (
        <div className="related-lives-section">
          <h3 className="related-lives-title">「{live.title}」の他公演</h3>
          <LiveList lives={relatedLives} />
        </div>
      )}
    </div>
  );
};

export default LiveDetail;
