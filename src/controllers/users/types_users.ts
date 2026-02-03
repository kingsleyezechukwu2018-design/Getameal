
export interface JwtTokenPayload {
  data: { userId: string, role: string };
  expiresIn?: string | number;
  audience?: "web" | "app";
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  COOK = "COOK",
}
