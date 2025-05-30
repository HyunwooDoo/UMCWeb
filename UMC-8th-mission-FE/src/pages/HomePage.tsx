import { useEffect, useRef, useState } from "react";
import LpCard from "../components/LpCard/LpCard.tsx";
import LPCardSkeleton from "../components/LpCard/LpCardSkeleton.tsx";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList.ts";
import { PAGINATION_ORDER } from "../enum/common.ts";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList.tsx";
import useDebounce from "../hooks/useDebounce.ts";

const HomePage = () => {
  // setSearch로 상태가 계속 변화 >> search값이 바뀌면서 리렌더링
  const [search, setSearch] = useState("");
  // 굿. 네트워크 요청이 가는 짧은 시간동안 처리하는 애니메이션을 참고하면 좋을듯. 시간은 사용자의 경험을 고려
  const debouncedValue = useDebounce(search, 300);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // QueryKey가 달라져야함
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetInfiniteLpList(10, debouncedValue, PAGINATION_ORDER.desc);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4 px-4 pt-12">
        {Array.from({ length: 10 }).map((_, i) => (
          <LPCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="h-[80vh] overflow-y-auto" ref={scrollRef}>
      <input
        className={"border p-2 rounded-sm mb-2"}
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-5 gap-4 px-4">
        {data?.pages.map((page, pageIndex) =>
          page.data.data.map((lp) => (
            <LpCard key={`${pageIndex}-${lp.id}`} lp={lp} />
          ))
        )}

        {isFetchingNextPage && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={observerRef} className="h-1" />
    </div>
  );
};

export default HomePage;
