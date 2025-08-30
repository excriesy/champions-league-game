// src/components/Standings.jsx
import TeamLogo from "./TeamLogo.tsx";

interface TeamStats {
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface StandingsProps {
  standings: [string, TeamStats][];
  onResetAll?: () => void;
}

export default function Standings({ standings, onResetAll }: StandingsProps) {
  const captureStandingsTable = () => {
    // Puan tablosu container'ını bul
    const standingsContainer = document.querySelector('.standings-container');
    if (!standingsContainer) return;

    // html2canvas kütüphanesini kullanarak ekran görüntüsü al
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(standingsContainer as HTMLElement, {
        background: '#ffffff',
        useCORS: true,
        allowTaint: true
      }).then((canvas: HTMLCanvasElement) => {
        // Canvas'ı resim olarak indir
        const link = document.createElement('a');
        link.download = `puan-tablosu-${new Date().toLocaleDateString('tr-TR')}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Tablo başlığı */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <img src="/logo/ucl.png" alt="UCL Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Puan Tablosu</h3>
        <img src="/logo/ucl.png" alt="UCL Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
      
      {/* Puan tablosu */}
      <div className="max-w-full p-1 sm:p-2 md:p-4 standings-container">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px] text-xs sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="p-1 sm:p-2 md:p-3 text-left text-xs sm:text-sm font-semibold border-b border-blue-400 w-10 sm:w-12 md:w-16">Sıra</th>
                <th className="p-1 sm:p-2 md:p-3 text-left text-xs sm:text-sm font-semibold border-b border-blue-400 w-32 sm:w-36 md:w-48">Takım</th>
                <th className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold border-b border-blue-400 w-8 sm:w-10 md:w-12">O</th>
                <th className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold border-b border-blue-400 w-8 sm:w-10 md:w-12">G</th>
                <th className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold border-b border-blue-400 w-8 sm:w-10 md:w-12">B</th>
                <th className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold border-b border-blue-400 w-8 sm:w-10 md:w-12">M</th>
                <th className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold border-b border-blue-400 w-8 sm:w-10 md:w-12">A</th>
                <th className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold border-b border-blue-400 w-8 sm:w-10 md:w-12">Y</th>
                <th className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold border-b border-blue-400 w-12 sm:w-16 md:w-20">Averaj</th>
                <th className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold border-b border-blue-400 w-10 sm:w-12 md:w-16">Puan</th>
              </tr>
            </thead>
            <tbody>
              {standings.map(([team, stats], index) => {
                const goalDifference = stats.goalsFor - stats.goalsAgainst;
                const goalDiffText = goalDifference > 0 ? `+${goalDifference}` : goalDifference.toString();
                
                // Sıralamaya göre renk belirle
                let rowColor = '';
                if (index < 8) {
                  rowColor = 'bg-green-50 border-l-4 border-l-green-500'; // İlk 8: Son 16 (Yeşil)
                } else if (index < 24) {
                  rowColor = 'bg-blue-50 border-l-4 border-l-blue-500'; // 9-24: Playoff (Mavi)
                } else {
                  rowColor = 'bg-red-50 border-l-4 border-l-red-500'; // 25-32: Elendi (Kırmızı)
                }
                
                return (
                  <tr 
                    key={index} 
                    className={`border-b transition-all duration-200 hover:bg-gray-50 ${rowColor}`}
                  >
                    <td className="p-1 sm:p-2 md:p-3 text-xs sm:text-sm font-bold">
                      <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gray-300 text-gray-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-xs sm:text-sm font-semibold text-gray-800">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <TeamLogo teamName={team} size="sm" />
                        <span className="text-gray-700 truncate">{team}</span>
                      </div>
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm text-gray-600 font-medium">
                      {stats.played}
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm text-gray-600 font-medium">
                      {stats.wins}
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm text-gray-600 font-medium">
                      {stats.draws}
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm text-gray-600 font-medium">
                      {stats.losses}
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm text-gray-600 font-medium">
                      {stats.goalsFor}
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm text-gray-600 font-medium">
                      {stats.goalsAgainst}
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-bold">
                      <span className={`px-1 sm:px-2 md:px-3 py-1 rounded-full text-xs sm:text-sm ${
                        goalDifference > 0 
                          ? 'bg-green-100 text-green-800' 
                          : goalDifference < 0 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {goalDiffText}
                      </span>
                    </td>
                    <td className="p-1 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-bold">
                      <span className="px-1 sm:px-2 md:px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                        {stats.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tablo açıklaması */}
      <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3">
            <img src="/logo/ucl.png" alt="UCL Logo" className="w-5 h-5 sm:w-6 sm:h-6" />
            <h4 className="font-semibold text-green-800 text-sm sm:text-base">Şampiyonlar Ligi Sıralaması</h4>
            <img src="/logo/ucl.png" alt="UCL Logo" className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">İlk 8: Direkt Son 16</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700 font-medium">9-24: Playoff</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
              <span className="text-red-700 font-medium">25-32: Elendi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sıfırlama butonu */}
      {onResetAll && (
        <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-2 sm:mb-3">⚙️ Veri Yönetimi</h4>
            <button
              onClick={onResetAll}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl text-xs sm:text-sm"
            >
              🗑️ Tüm Verileri Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* Ekran görüntüsü alma tuşu */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
        <div className="text-center">
          <h4 className="font-semibold text-blue-800 text-sm sm:text-base mb-2 sm:mb-3">📸 Puan Tablosu Paylaşımı</h4>
          <button
            onClick={captureStandingsTable}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl text-xs sm:text-sm"
          >
              📸 Puan Tablosu Ekran Görüntüsü Al
          </button>
        </div>
      </div>
    </div>
  );
}
