import {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

//회원가입 API
export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("v1/auth/signup", body);
  return data;
};
//로그인 API
export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("v1/auth/signin", body);

  return data;
};
//로그아웃 API
export const postLogout = async () => {
  const { data } = await axiosInstance.post("v1/auth/signout");
  return data;
};

// axiox.post의 인자 순서= 1.URL 2. Body(data) 3. Config (header 등)
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("v1/users/me");
  return data;
};
