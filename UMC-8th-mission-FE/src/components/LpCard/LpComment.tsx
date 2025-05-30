import { useGetComments } from "../../hooks/queries/useGetComments";

const LpComments = ({ lpId }: { lpId: number }) => {
  const { data, isLoading, isError } = useGetComments(lpId);

  if (isLoading) return <p>댓글을 불러오는 중입니다...</p>;
  if (isError) return <p>댓글을 불러오는 데 실패했습니다.</p>;

  return (
    <div className="bg-zinc-800 rounded-lg p-4 mt-10 w-full max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">댓글</h3>

      {/* 댓글 입력창 */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          className="flex-1 px-3 py-2 rounded bg-zinc-700 text-white outline-none"
        />
        <button className="bg-pink-600 px-4 py-2 rounded text-white hover:bg-pink-700">
          작성
        </button>
      </div>

      {/* 댓글 리스트 */}
      <ul className="space-y-4">
        {data?.data.data.map((comment) => (
          <li key={comment.id} className="flex items-start gap-3">
            <img
              src={comment.author.avatar}
              alt="작성자"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {comment.author.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className="text-sm text-gray-300">{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LpComments;
