import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { Likes, ResponseLpDto } from "../../types/lp";
import { ResponseMyInfoDto } from "../../types/auth";
// import { QUERY_KEY } from "../../constants/key";
// import { queryClient } from "../../App";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    // onMutate: API 요청 이전에 호출되는 것
    // UI에 바로 변경된다는 것을 보여주기 위해 Cache를 업데이트
    onMutate: async (lp) => {
      // 1. 게시글에 관련된 쿼리를 취소: 캐시된 데이터를 새로 불러오는 요청
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpId],
      });

      // 2. 현재 게시글의 데이터를 캐시에서 가져옴
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lp.lpId,
      ]);
      // 게시글 데이터를 복사해서 NewLpPost 새로운 객체를 만듦
      // 복사하는 이유: 추후 오류 발생 시 이전 상태로 되돌리기 위함
      const newLpPost = { ...previousLpPost };

      // 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾아야함
      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      const userId = Number(me?.data.id);

      const likedIndex =
        previousLpPost?.data.likes.findIndex(
          (like: Likes) => like.userId === userId
        ) ?? -1;

      // 좋아요 취소를 눌렀는데도 좋아요가 쌓이기만함. 인덱스를 인식을 못하는 경우.
      // 0을 포함해서 처리 해줘야 정상적으로 취소처리 진행
      if (likedIndex >= 0) {
        previousLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = { userId, lpId: lp.lpId } as Likes;
        previousLpPost?.data.likes.push(newLike);
      }

      // 업데이트된 게시글 데이터를 캐시에 저장
      // UI가 바로 업데이트 됨. 사용자가 변화를 확인할 수 있음
      queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);
      return { previousLpPost, newLpPost };
    },

    onError: (err, newLp, context) => {
      console.log(err, newLp);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp.lpId],
        context?.previousLpPost?.data.id
      );
    },

    // onSettled는 API 요청이 끝난 후 (성공하든 실패하든 무조건 실행)
    onSettled: async (data, error, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, variables.lpId],
      });
    },
    /*  onSuccess: (data, variables, context) => {
    // invalidate로 화면에 즉각 반영
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
      console.log(context);
    },
    //요청 직전에 실행되기 직전에 실행되는 함수 => Optimistic Update를 구현할 때 유용
    //Optimistic Update
    onMutate: (variables) => {
      console.log(variables);
      return "좋아요취소";
    }, */
  });
}

export default useDeleteLike;
