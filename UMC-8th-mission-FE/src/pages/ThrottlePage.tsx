import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
  // 상태로 관리
  const [scrollY, setScrollY] = useState<number>(0);

  const handleScroll = useThrottle(() => {
    // 계속 실시간으로 업데이트 될 필요가 없음. 최종 목적지에서 업데이트
    setScrollY(window.scrollY);
  }, 1000);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <div>
        <h1>THROTTLING</h1>
        <p>ScrollY: {scrollY}px</p>
      </div>
    </div>
  );
};

export default ThrottlePage;
