import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import { useState } from "react";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

export default HomeLayout;
