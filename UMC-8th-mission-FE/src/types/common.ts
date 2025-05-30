import { PAGINATION_ORDER } from "../enum/common";

export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type CursorBasedResponse<T> = CommonResponse<{
  data: T;
  nextCursor: number | null;
  hasNext: boolean;
}>;

//필수가 아니라서 모든 값을 optional처리 해준다.
export type PaginationDto = {
  cursor?: number | null;
  limit?: number;
  search?: string;
  order?: PAGINATION_ORDER;
};
