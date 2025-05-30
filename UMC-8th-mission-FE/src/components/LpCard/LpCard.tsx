import { useNavigate } from "react-router-dom";
import { LpItem } from "../../types/lp";
import { useAuth } from "../../context/AuthContext";

interface Props {
  lp: LpItem;
}

const LpCard = ({ lp }: Props) => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleClick = () => {
    if (!accessToken) {
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다. \n로그인 화면으로 이동할까요?"
        )
      ) {
        navigate("/login");
      }
      return;
    }
    navigate(`/lp/${lp.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative group rounded overflow-hidden hover:scale-110 cursor-pointer"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full aspect-square object-cover transition-transform duration-300 "
      />
      {/* Hover 시 나타나는 오버레이 */}
      <div
        className="absolute inset-0 
                    bg-black 
                    bg-opacity-70 
                    opacity-0 
                    group-hover:opacity-60
                    transition-opacity duration-300 
                    flex flex-col justify-end p-4
                  text-white backdorp-blur-sm"
      >
        <p className="text-white font-bold text-sm line-clamp-2">{lp.title}</p>
        <div className="flex justify-between items-center text-xs text-white mt-2">
          <span>{getTimeAgo(lp.createdAt)}</span>
          <span>❤️ {lp.likes.length}</span>
        </div>
      </div>
      {/* <LpCardSkeleton /> */}
    </div>
  );
};

const getTimeAgo = (dateStr: Date) => {
  const minutes = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 60000
  );
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};

export default LpCard;
