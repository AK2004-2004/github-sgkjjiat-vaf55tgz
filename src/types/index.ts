export interface FilterConfig {
  enabled: boolean;
  secretWord: string;
  maxSize: number; // en Mo
  exceptions: string[];
}

export interface User {
  email: string;
  name: string;
  picture: string;
}