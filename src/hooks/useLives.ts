import { useState, useEffect } from "react";
import Papa from "papaparse";
import type { Live } from "../types";

export const useLives = () => {
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // publicディレクトリ直下のdata.csvを読み込む
    Papa.parse<Live>("/data.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setLives(results.data);
        setLoading(false);
      },
      error: (error) => {
        console.error("CSVの読み込みに失敗しました:", error);
        setLoading(false);
      },
    });
  }, []);

  return { lives, loading };
};
