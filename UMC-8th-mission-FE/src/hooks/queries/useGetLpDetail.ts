import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { LpDetail } from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";

export const useGetLpDetail = (lpId: number) => {
  return useQuery<LpDetail>({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: () => getLpDetail(lpId),
    enabled: !!lpId,
  });
};
