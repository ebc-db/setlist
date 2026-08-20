import { useState, useEffect } from "react";
import Papa from "papaparse";
import type { TagColor } from "../types/index.ts";

export const useTagColors = () => {
  const [tags, setTags] = useState<TagColor[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}tags.csv`);
        if (!response.ok) throw new Error("tags.csvの取得に失敗しました");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setTags(results.data as TagColor[]);
          },
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  return { tags };
};
