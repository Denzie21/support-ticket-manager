export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
}

export const customers: Customer[] = [
  {
    id: 1,
    name: "Leanne Graham",
    email: "Sincere@april.biz",
    company: "Romaguera-Crona"
  },
  {
    id: 2,
    name: "Ervin Howell",
    email: "Shanna@melissa.tv",
    company: "Deckow-Crist"
  },
  {
    id: 3,
    name: "Clementine Bauch",
    email: "Nathan@yesenia.net",
    company: "Romaguera-Jacobson"
  }
];