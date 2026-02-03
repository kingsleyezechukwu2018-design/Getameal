import { UserEntity } from "models/users/users.entity";

export enum OtpType {
    AUTH = "AUTH", //covers both signup and login OTPs
}

export const AllowedLoginOtpTypes = [OtpType.AUTH];

export interface VerifyOtpResponse {
    isOtpVerified: boolean;
    user?: UserEntity;
    accessToken?: string;
}