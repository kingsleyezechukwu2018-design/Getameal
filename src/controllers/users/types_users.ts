
export interface JwtTokenPayload {
  data: { userId: string, role: string };
  expiresIn?: string
  audience?: "web" | "app";
  secret?: string;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  COOK = "COOK",
}
