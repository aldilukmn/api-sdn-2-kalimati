interface DecodedType {
  user: string;
  role: string;
  grade?: string;
  iat: number;
  exp: number;
};

export type { DecodedType };