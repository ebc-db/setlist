import React, { useState, useMemo } from "react";
import type { Member, SearchQuery } from "../types/index.ts";
import { useTagColors } from "../hooks/useTagColors.ts";

interface SearchFormProps {
  query: SearchQuery;
  setQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
  uniqueYears: string[];
  uniquePrefectures: string[];
  uniqueCountries: string[];
  members: string[];
  memberColors: Member[];
  uniqueVenues: string[];
  songRanking: { song: string; count: number }[];
}

const SearchForm: React.FC<SearchFormProps> = ({ query, setQuery, uniqueYears, uniquePrefectures, uniqueCountries, members: members, memberColors, uniqueVenues, songRanking }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { tags: tagColors } = useTagColors();

  // 入力文字から候補を最大5件抽出
  const suggestions = useMemo(() => {
    if (!query.song) return [];

    // スペースを含むキーワードなどで部分一致検索する
    const lowerQuery = query.song.toLowerCase().trim();
    return songRanking.filter((item) => item.song.toLowerCase().includes(lowerQuery)).slice(0, 5); // 上位5件
  }, [query.song, songRanking]);

  // 検索条件を変更する処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "prefecture") {
      setQuery((prev) => ({ ...prev, prefecture: value, country: "", venue: "" }));
    } else if (name === "country") {
      setQuery((prev) => ({ ...prev, country: value, venue: "" }));
    } else {
      setQuery((prev) => ({ ...prev, [name]: value }));
    }
  };

  // メンバー・タグのトグルボタンを切り替える処理
  const toggleArrayItem = (key: "members" | "tags", value: string) => {
    setQuery((prev) => {
      const current = prev[key];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((item) => item !== value) };
      } else {
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  // テキスト入力をクリアする処理
  const handleClear = (name: "song" | "venue") => {
    setQuery((prev) => ({ ...prev, [name]: "" }));
  };

  // すべての条件をリセットする処理
  const handleReset = () => {
    setQuery({ song: "", year: "", venue: "", prefecture: "", country: "", members: [], tags: [] });
  };

  return (
    <div className="controls-wrapper">
      <div className="control-section">
        <h2>曲名検索</h2>

        <div className="search-wrapper" style={{ marginBottom: "10px" }}>
          <input
            type="text"
            className="search-box"
            name="song"
            value={query.song}
            onChange={handleChange}
            placeholder="曲名で検索"
            onFocus={() => setShowSuggestions(true)}
            // 候補クリックより先にBlurが発火してリストが消えるのを防ぐため、少し遅らせる
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {query.song && (
            <button className="clear-search-btn" onClick={() => handleClear("song")}>
              ×
            </button>
          )}

          {/* サジェストリストの表示 */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item) => (
                <li
                  key={item.song}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery((prev) => ({ ...prev, song: item.song }));
                    setShowSuggestions(false);
                  }}
                >
                  <span className="suggestion-song">{item.song}</span>
                  <span className="suggestion-count">({item.count}回)</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="control-section">
        <h2>メンバー</h2>
        <div className="filter-container">
          {members.map((member) => {
            const isActive = query.members.includes(member);
            // CSVから該当メンバーの色を取得（見つからなければデフォルトのグレー）
            const memberObj = memberColors.find((a) => a.name === member);
            const bgColor = memberObj ? memberObj.color : "#6c757d";

            return (
              <button
                key={member}
                type="button"
                className={`filter-btn ${isActive ? "active" : ""}`}
                // アクティブのときはCSVのカラー、非アクティブのときは薄いグレーなどにする
                style={{
                  backgroundColor: isActive ? bgColor : "#f5f5f5",
                  color: isActive ? "#fff" : "#666",
                  borderColor: isActive ? bgColor : "#ccc",
                }}
                onClick={() => toggleArrayItem("members", member)}
              >
                {member}
              </button>
            );
          })}
        </div>
      </div>

      <div className="control-section">
        <h2>公演日</h2>
        <div className="dropdown-container">
          <select className="year-selector" name="year" value={query.year} onChange={handleChange}>
            <option value="">すべての年</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="control-section">
        <h2>会場</h2>
        <div className="dropdown-container">
          <select className="year-selector" name="prefecture" value={query.prefecture} onChange={handleChange}>
            <option value="">都道府県を選択</option>
            {uniquePrefectures.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
          {/* 海外が選択された時のみ国選択を表示 */}
          {query.prefecture === "海外" && (
            <select className="year-selector" name="country" value={query.country} onChange={handleChange}>
              <option value="">すべての国</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
          <select className="year-selector" name="venue" value={query.venue} onChange={handleChange} disabled={query.prefecture === "配信"}>
            <option value="">会場を選択</option>
            {uniqueVenues.map((venue) => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="control-section">
        <h2>タグ</h2>
        <div className="filter-container">
          {/* uniqueTags ではなく、CSVから取得した tagColors を直接回す */}
          {tagColors.map((tagInfo) => {
            // CSVの空行対策と、前後の空白除去
            const tag = tagInfo.tag?.trim();
            if (!tag) return null;

            const isActive = query.tags.includes(tag);
            // CSVの色を取得（念のため設定漏れ時のデフォルト色も指定）
            const bgColor = tagInfo.color || "#34495e";

            return (
              <button
                key={tag}
                type="button"
                className={`filter-btn ${isActive ? "active" : ""}`}
                style={{
                  backgroundColor: isActive ? bgColor : "#f5f5f5",
                  color: isActive ? "#fff" : "#666",
                  borderColor: isActive ? bgColor : "#ccc",
                }}
                onClick={() => toggleArrayItem("tags", tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="reset-section">
        <button type="button" className="reset-btn" onClick={handleReset}>
          条件をリセット
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
