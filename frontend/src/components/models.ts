export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Plant {
  id: string;
  name: string;
  room: string;
  picture: string;
  drying_interval: number;
  link: string;
}
