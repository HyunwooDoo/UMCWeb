import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useGetLpList from "../hooks/queries/useGetLpList";
import LpCard from "../components/LpCard/LpCard";
import { PAGINATION_ORDER } from "../enum/common";

const MyPage = () => {
  const { data: myInfo } = useGetMyInfo();

  // ✅ 일반 리스트 쿼리로 전체 LP 가져오기
  const {
    data: lpList,
    isLoading,
    isError,
  } = useGetLpList({
    cursor: null,
    search: "",
    order: PAGINATION_ORDER.desc,
    limit: 100,
  });

  if (isLoading) return <p className="text-white">로딩 중...</p>;
  if (isError || !lpList) return <p className="text-white">불러오기 실패</p>;

  const myId = myInfo?.data.id;

  // ✅ 내가 작성한 LP만 필터링
  const myLps = lpList.data.filter((lp) => lp.authorId === myId);
  const likedLps = lpList.data.filter((lp) =>
    lp.likes?.some((like) => like.userId === myId)
  );

  return (
    // <div>마이페이지</div>
    <div className="px-4 py-10 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-10">MYPage</h1>

      {/* 내가 생성한 LP */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">💿 내가 만든 LP</h2>
        {myLps.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-2 gap-6">
            {myLps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">작성한 LP가 없습니다.</p>
        )}
      </section>

      {/* 좋아요한 LP */}
      <section>
        <h2 className="text-xl font-semibold mb-6">👻 좋아요한 LP</h2>
        {likedLps.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-2 gap-6">
            {likedLps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">좋아요한 LP가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default MyPage;
