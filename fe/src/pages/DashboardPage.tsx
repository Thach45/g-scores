import { 
  GraduationCap, 
  LayoutDashboard, 
  ArrowRight
} from 'lucide-react';
import SearchForm from '../features/search/SearchForm';
import ScoreResult from '../features/search/ScoreResult';
import StatisticsChart from '../features/statistics/StatisticsChart';
import LeaderboardTable from '../features/leaderboard/LeaderboardTable';
import { useDashboardData } from '../hooks/useDashboardData';
import { useScoreSearch } from '../hooks/useScoreSearch';

export default function DashboardPage() {
  const { scoreResult, errorMsg, isLoading, handleSearch } = useScoreSearch();
  const { statsData, top10Data, isStatsLoading, isTop10Loading } = useDashboardData();

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-20">
        <div className="h-16 flex items-center px-6 gap-3">
          <div className="bg-black p-1.5 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">G-Scores</h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Overview</div>
            <div className="space-y-1">
              <MenuItem icon={<LayoutDashboard />} label="Dashboard" isActive={true} onClick={() => {}} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold text-sm">
              AD
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">G-Scores System</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 z-10 justify-end">
          <div className="text-sm font-medium text-gray-500">
            Kỳ thi THPT Quốc Gia 2024
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Hệ thống tra cứu và thống kê điểm thi THPT Quốc Gia 2024.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              <div className="xl:col-span-2 space-y-6">
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Tra cứu điểm thi</h3>
                      <p className="text-sm text-gray-500">Nhập số báo danh để xem chi tiết điểm</p>
                    </div>
                  </div>
                  
                  <SearchForm onSearch={handleSearch} isLoading={isLoading} errorMsg={errorMsg} />
                  {scoreResult && (
                    <div className="mt-6">
                      <ScoreResult scoreData={scoreResult} />
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Phổ điểm các môn</h3>
                      <p className="text-sm text-gray-500">Thống kê theo 4 mức độ điểm</p>
                    </div>
                  </div>
                  
                  <StatisticsChart data={statsData} isLoading={isStatsLoading} />
                </div>

              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Top 10 Khối A</h3>
                    <p className="text-sm text-gray-500">Danh sách thủ khoa toàn quốc</p>
                  </div>
                  
                  <LeaderboardTable data={top10Data} isLoading={isTop10Loading} />
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function MenuItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
        isActive 
          ? 'bg-gray-100 text-gray-900' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className={isActive ? 'text-gray-900' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
