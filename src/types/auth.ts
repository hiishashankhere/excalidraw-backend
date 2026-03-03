export interface AuthTokenPayload {
  userId: number;
  email: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
}
