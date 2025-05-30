import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { useQuery } from "@tanstack/react-query";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: userProfile,
    // isPending,
    // isError,
    // isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    select: (data) => data.data,
    staleTime: Infinity,
    refetchInterval: 1000 * 60 * 5,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      className="ixed top-0 left-0 w-full flex items-center justify-between p-4 bg-zinc-900
            backdrop-blur z-50 shadow-md border-b border-gray-700"
    >
      <div className="text-xl font-bold text-pink-500">
        <div>
          <button
            onClick={onToggleSidebar}
            className="text-white text-2xl hover:text-pink-400 cursor-pointer"
          >
            ☰
          </button>
          <a href="/" className="test-white hover:text-pink-400 px-4">
            👻DUDU
          </a>
        </div>
      </div>
      <div className="space-x-2">
        {/* <a href="/" className="text-white hover:text-pink-400" >
                    홈
                </a> */}

        {accessToken && (
          <div className="flex flex-row gap-5">
            <div>🔍 {userProfile?.name}! Welcome</div>
            <button
              className="text-white rounded-sm hover:text-pink-400 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}

        {!accessToken && (
          <>
            <a href="/login" className="text-white hover:text-pink-400">
              Login
            </a>
            <a
              href="/signup"
              className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition"
            >
              Signup
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
