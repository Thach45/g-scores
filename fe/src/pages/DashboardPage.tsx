import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import SearchForm from '../features/search/SearchForm';
import ScoreResult from '../features/search/ScoreResult';
import type { ScoreResponseDto } from '../types';

export default function DashboardPage() {

  const [scoreResult, setScoreResult] = useState<ScoreResponseDto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (sbd: string) => {
    
    console.log('User đang tìm SBD:', sbd);
    setIsLoading(true);
    
  
    setTimeout(() => {
      setIsLoading(false);
    
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">G-Scores</h1>
          </div>
          <div className="text-sm text-gray-500 font-medium hidden sm:block">
            Kỳ thi THPT Quốc Gia 2024
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section 1: Search Form */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Tra cứu điểm thi</h2>
            <p className="text-gray-500">Nhập chính xác 8 số báo danh của bạn để xem kết quả</p>
          </div>
          
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            errorMsg={errorMsg} 
          />
          
          {scoreResult && <ScoreResult scoreData={scoreResult} />}
        </section>

        {/* Section 2: Dashboard */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Statistics Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Phổ điểm các môn
            </h3>
          
            <div className="h-80 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              [Bar Chart Placeholder]
            </div>
          </div>

         
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
              Top 10 Khối A
            </h3>
           
            <div className="h-80 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              [Leaderboard Table Placeholder]
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
