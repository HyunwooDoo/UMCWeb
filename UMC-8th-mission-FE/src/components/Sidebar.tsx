interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={` transition-all duration-300 bg-zinc-900 p-4 flex flex-col ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {/* 접혀있으면 내부 렌더링 안함 */}
      {isOpen && (
        <>
          <nav className="space-y-2">
            <div>
              <a href="/serch" className="text-white hover:text-pink-400">
                🔍 Search
              </a>
            </div>
            <div>
              <a href="/me" className="text-white hover:text-pink-400">
                👤 MYPage
              </a>
            </div>
          </nav>

          <div className="mt-auto text-yellow-400">⚠️ 탈퇴하기</div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
