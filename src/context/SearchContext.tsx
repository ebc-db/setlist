import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import type { SearchQuery } from "../types/index.ts";

// 共有するデータの型を定義
interface SearchContextType {
  query: SearchQuery;
  setQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
}

// 初期状態
const initialQuery: SearchQuery = {
  song: "",
  year: "",
  venue: "",
  prefecture: "",
  country: "",
  members: [],
  tags: [],
};

// Contextを作成
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// アプリ全体を包むProviderコンポーネント
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<SearchQuery>(initialQuery);

  return <SearchContext.Provider value={{ query, setQuery }}>{children}</SearchContext.Provider>;
};

// カスタムフックとして使いやすくする
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
