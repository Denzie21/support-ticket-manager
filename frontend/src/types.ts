
export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
}

// Structure returned by JSONPlaceholder
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}
