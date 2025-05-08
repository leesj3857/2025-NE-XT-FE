export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  token: string;
}

export interface ResetRequestPayload {
  email: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}
