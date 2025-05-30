import { useQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";

export const useGetComments = (lpId: number) => {
  return useQuery({
    queryKey: ["comments", lpId],
    queryFn: () => getLpComments(lpId),
    enabled: !!lpId, // lpId가 유효할 때만 실행
  });
};
