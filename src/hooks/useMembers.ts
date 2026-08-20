import { useState, useEffect } from "react";
import Papa from "papaparse";
import type { Member } from "../types/index.ts";

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    Papa.parse<Member>(`${import.meta.env.BASE_URL}members.csv`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setMembers(results.data);
      },
    });
  }, []);

  return { members };
};
