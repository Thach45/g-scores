import type { ScoreResponseDto } from '../../types';

interface ScoreResultProps {
  scoreData: ScoreResponseDto;
}

export default function ScoreResult({ scoreData }: ScoreResultProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white border-2 border-green-100 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Kết quả điểm thi</h3>
        <p className="text-green-600 font-medium text-lg">SBD: {scoreData.sbd}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ScoreBox label="Toán" score={scoreData.toan} />
        <ScoreBox label="Ngữ Văn" score={scoreData.nguVan} />
        <ScoreBox label="Ngoại Ngữ" score={scoreData.ngoaiNgu} />
        <ScoreBox label="Vật Lí" score={scoreData.vatLi} />
        <ScoreBox label="Hóa Học" score={scoreData.hoaHoc} />
        <ScoreBox label="Sinh Học" score={scoreData.sinhHoc} />
        <ScoreBox label="Lịch Sử" score={scoreData.lichSu} />
        <ScoreBox label="Địa Lí" score={scoreData.diaLi} />
        <ScoreBox label="GDCD" score={scoreData.gdcd} />
      </div>
    </div>
  );
}

function ScoreBox({ label, score }: { label: string; score: number | null }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
      <span className="text-sm font-medium text-gray-500 mb-1">{label}</span>
      <span className="text-2xl font-bold text-gray-900">
        {score !== null ? score : '-'}
      </span>
    </div>
  );
}
