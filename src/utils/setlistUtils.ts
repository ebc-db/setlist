// 文字列を解析してメドレーと注釈を判定するヘルパー関数
export const parseTrack = (trackStr: string) => {
  const isMedley = trackStr.includes("//");
  const songs = trackStr.split("//").map((s) => {
    // "@"で分割して、インデックス0を曲名、それ以降を注釈として扱う
    const [title, ...noteParts] = s.split("@");
    return {
      title: title.trim(),
      note: noteParts.join("@").trim(),
    };
  });
  return { isMedley, songs };
};

// セットリスト文字列から、純粋な曲名が完全一致するかどうかを判定するヘルパー関数
export const isExactMatch = (setlistStr: string | undefined, targetSong: string) => {
  if (!setlistStr) return false;
  const tracks = setlistStr.split("|");
  for (const trackStr of tracks) {
    const songs = trackStr.split("//");
    for (const songStr of songs) {
      const title = songStr.split("@")[0].trim();
      if (title === targetSong) return true;
    }
  }
  return false;
};

// 1つの公演の中で、その曲が何回披露されたかを正確にカウントする関数
export const countExactMatch = (setlistStr: string | undefined, targetSong: string) => {
  if (!setlistStr) return 0;
  let count = 0;
  const tracks = setlistStr.split("|");
  for (const trackStr of tracks) {
    const songs = trackStr.split("//");
    for (const songStr of songs) {
      const title = songStr.split("@")[0].trim();
      if (title === targetSong) count++;
    }
  }
  return count;
};
