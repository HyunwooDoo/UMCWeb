import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const ProtectedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { accessToken } = useAuth();

  if (!accessToken) {
    //accessToken이 없으면 => login페이지로 이동
    return <Navigate to={"/login"} replace />;
  }

  // return <Outlet/>;
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      {/* 사이드바 + 본문 콘텐츠 */}
      <div className="flex flex-1 min-h-0">
        <Sidebar isOpen={isSidebarOpen} />
        {/* 본문 */}
        <main className="flex-1 pt-6 px-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {/* 푸터 */}
      <footer className="p-4 bg-black text-white text-center border-t border-gray-700">
        ⓒ DUDU
      </footer>
    </div>
  );
};

export default ProtectedLayout;
