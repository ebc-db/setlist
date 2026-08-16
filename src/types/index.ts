export interface Live {
  id: string;
  member_id: string;
  date: string;
  title: string;
  venue: string;
  prefecture: string;
  setlist_main: string;
  setlist_encore: string;
  tags?: string;
}

export interface SearchQuery {
  song: string;
  year: string;
  venue: string;
  prefecture: string;
  country: string;
  members: string[];
  tags: string[];
}

export interface Member {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

export interface TagColor {
  tag: string;
  color: string;
  bgColor: string;
}
