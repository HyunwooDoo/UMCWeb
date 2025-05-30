import { useParams } from "react-router-dom";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import LpComments from "../components/LpCard/LpComment";
import useGetMyIfo from "../hooks/queries/useGetMyInfo";
// import { deleteLike, postLike } from "../apis/lp";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
// import { formatDistanceToNow } from "date-fns";
// 상세페이지
const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { data, isLoading, isError } = useGetLpDetail(Number(lpId));
  const { data: myinfo } = useGetMyIfo();
  //mutateAsync -> Promise를 반환해서 await 사용가능
  //usePostLike 훅 사용하는 곳에
  const { mutate: likeMutate } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();

  //방법 1.
  // const isLiked = data?.data.likes
  //   .map((like) => like.userId)
  //   .includes(myinfo?.data.id as number);
  //방법 2.
  //some 함수 -> 주어진 판별 함수를 하나라도 통과하는지 테스트 (주어진 함수가 true 면 true 반환. )
  const isLiked = data?.data.likes.some(
    (like) => like.userId === myinfo?.data.id
  );

  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) }); //mutate를 연결할 때 async를 빼줌
  };

  const handleDislikeLp = () => {
    dislikeMutate({ lpId: Number(lpId) }); //mutate를 연결할 때 sync를 빼줌
  };

  if (isLoading) return <p className="text-white">로딩 중...</p>;
  if (isError || !data?.data)
    return <p className="text-white">불러오기 실패</p>;

  const lp = data.data;
  // const me = myinfo?.data;

  return (
    <div className="flex justify-center px-4 mb-16 text-white min-h-screen">
      <div className="bg-zinc-800 w-full max-w-5xl rounded-xl shadow-md px-10 py-10 relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          {/* 작성자 + 제목 + 날짜 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <img
                src={lp.author?.avatar || "/default-avatar.png"}
                alt="작성자 프로필"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">
                {lp.author?.name || "작성자"}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-1">{lp.title}</h2>
          </div>

          {/* 수정/삭제 버튼 */}
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <button className="hover:text-white cursor-pointer">✏️ 수정</button>
            <button className="hover:text-white cursor-pointer">🗑 삭제</button>
          </div>
        </div>

        {/* 썸네일 */}
        <div className="relative w-[360px] h-[360px] mx-auto rounded-xl bg-zinc-800 shadow-2xl p-4 border-zinc-900">
          {/* CD 이미지 */}
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full rounded-full object-cover"
          />

          {/* 중앙 구멍 */}
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-black border border-black rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
        </div>

        {/* 설명 */}
        <p className="text-base mb-6 leading-relaxed text-gray-200 whitespace-pre-line">
          {lp.content}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {lp.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-gray-700 text-sm px-4 py-1 rounded-full text-gray-200"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        {/* 좋아요 */}
        <button
          onClick={isLiked ? handleDislikeLp : handleLikeLp}
          className="flex justify-center items-center gap-2 text-pink-400 text-xl hover:scale-105"
        >
          {isLiked ? "❤️" : "🤍"}
          <span className="text-white">{lp.likes.length}</span>
        </button>

        {/*댓글*/}
        {lpId && <LpComments lpId={Number(lpId)} />}
      </div>
    </div>
  );
};

export default LpDetailPage;
