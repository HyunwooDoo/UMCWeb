import { PaginationDto } from "../types/common";
import {
  RequestLpDto,
  ResponseLikeLpDto,
  ResponseLpListDto,
} from "../types/lp";
import { axiosInstance } from "./axios";
//전체 LP 목록 가져오기
export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

//내 LP목록 불러오기
export const getMyLpList = async (): Promise<ResponseLpListDto> => {
  const response = await axiosInstance.get("/v1/lps/user");
  return response.data;
};

//LP 디테일정보 불러오기
export const getLpDetail = async (lpId: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data; // CommonResponse<LpItem>
};

//LP의 댓글 불러오기
export const getLpComments = async (lpId: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`);
  return data;
};

//LP에 좋아요 누르기
export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

//LP에 좋아요 직우기
export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

//내가 좋아요 누른 LP 보기
export const getMyLikeLpList = async (): Promise<ResponseLpListDto> => {
  const response = await axiosInstance.get(`/v1/lps/likes/me`);
  return response.data;
};
