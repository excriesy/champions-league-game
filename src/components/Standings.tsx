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
    <div className="space-y-2 sm:space-y-3 xl:space-y-4">
      {/* Tablo başlığı */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 xl:space-x-4 mb-1 sm:mb-2 xl:mb-4">
        <img src="/logo/ucl.png" alt="UCL Logo" className="w-4 h-4 sm:w-6 sm:h-6 xl:w-12 xl:h-12" />
        <h3 className="text-sm sm:text-lg xl:text-3xl font-bold text-gray-800">Puan Tablosu</h3>
        <img src="/logo/ucl.png" alt="UCL Logo" className="w-4 h-4 sm:w-6 sm:h-6 xl:w-12 xl:h-12" />
      </div>
      
      {/* Puan tablosu */}
      <div className="max-w-full p-0.5 sm:p-1 xl:p-4 standings-container">
        <div className="w-full">
          <table className="w-full border-collapse text-xs sm:text-sm xl:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="p-0.5 sm:p-1 xl:p-4 text-left text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-6 sm:w-8 xl:w-16">Sıra</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-left text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-16 sm:w-20 xl:w-40">Takım</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-4 sm:w-6 xl:w-12">O</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-4 sm:w-6 xl:w-12">G</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-4 sm:w-6 xl:w-12">B</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-4 sm:w-6 xl:w-12">M</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-4 sm:w-6 xl:w-12">A</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-4 sm:w-6 xl:w-12">Y</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-6 sm:w-8 xl:w-16">Averaj</th>
                <th className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-semibold border-b border-blue-400 w-5 sm:w-6 xl:w-14">Puan</th>
              </tr>
            </thead>
            <tbody>
              {standings.map(([team, stats], index) => {
                const goalDifference = stats.goalsFor - stats.goalsAgainst;
                const goalDiffText = goalDifference > 0 ? `+${goalDifference}` : goalDifference.toString();
                
                // Sıralamaya göre renk belirle
                let rowColor = '';
                if (index < 8) {
                  rowColor = 'bg-green-50 border-l-2 border-l-green-500'; // İlk 8: Son 16 (Yeşil)
                } else if (index < 24) {
                  rowColor = 'bg-blue-50 border-l-2 border-l-blue-500'; // 9-24: Playoff (Mavi)
                } else {
                  rowColor = 'bg-red-50 border-l-2 border-l-red-500'; // 25-32: Elendi (Kırmızı)
                }
                
                return (
                  <tr 
                    key={index} 
                    className={`border-b ${rowColor}`}
                  >
                    <td className="p-0.5 sm:p-1 xl:p-4 text-xs sm:text-sm xl:text-base font-bold">
                      <span className="inline-flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 xl:w-8 xl:h-8 rounded-full bg-gray-300 text-gray-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-xs sm:text-sm xl:text-base font-semibold text-gray-800">
                      <div className="flex items-center space-x-1 sm:space-x-2 xl:space-x-3">
                        <TeamLogo teamName={team} size="sm" />
                        <span className="text-gray-700 truncate">{team}</span>
                      </div>
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base text-gray-600 font-medium">
                      {stats.played}
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base text-gray-600 font-medium">
                      {stats.wins}
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base text-gray-600 font-medium">
                      {stats.draws}
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base text-gray-600 font-medium">
                      {stats.losses}
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base text-gray-600 font-medium">
                      {stats.goalsFor}
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base text-gray-600 font-medium">
                      {stats.goalsAgainst}
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-bold">
                      <span className={`px-0.5 py-0 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded text-xs sm:text-sm xl:text-base ${
                        goalDifference > 0 
                          ? 'bg-green-100 text-green-800' 
                          : goalDifference < 0 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {goalDiffText}
                      </span>
                    </td>
                    <td className="p-0.5 sm:p-1 xl:p-4 text-center text-xs sm:text-sm xl:text-base font-bold">
                      <span className="px-0.5 py-0 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded bg-gray-100 text-gray-800">
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
      <div className="mt-2 sm:mt-3 xl:mt-6 p-1 sm:p-2 xl:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-md sm:rounded-lg xl:rounded-xl border border-green-200">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 xl:space-x-3 mb-1 sm:mb-2 xl:mb-3">
            <img src="/logo/ucl.png" alt="UCL Logo" className="w-3 h-3 sm:w-4 sm:h-4 xl:w-6 xl:h-6" />
            <h4 className="font-semibold text-green-800 text-xs sm:text-sm xl:text-lg">Şampiyonlar Ligi Sıralaması</h4>
            <img src="/logo/ucl.png" alt="UCL Logo" className="w-3 h-3 sm:w-4 sm:h-4 xl:w-6 xl:h-6" />
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-0.5 sm:space-y-0 sm:space-x-3 xl:space-x-6 text-xs sm:text-sm xl:text-base">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 xl:space-x-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 xl:w-4 xl:h-4 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">İlk 8: Direkt Son 16</span>
            </div>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 xl:space-x-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 xl:w-4 xl:h-4 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700 font-medium">9-24: Playoff</span>
            </div>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 xl:space-x-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 xl:w-4 xl:h-4 bg-red-500 rounded-full"></div>
              <span className="text-red-700 font-medium">25-32: Elendi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sıfırlama butonu */}
      {onResetAll && (
        <div className="mt-2 sm:mt-3 xl:mt-6 p-1 sm:p-2 xl:p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-md sm:rounded-lg xl:rounded-xl border border-gray-200">
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 xl:mb-3 text-xs sm:text-sm xl:text-lg">⚙️ Veri Yönetimi</h4>
            <button
              onClick={onResetAll}
              className="px-2 sm:px-4 xl:px-6 py-1 sm:py-2 xl:py-3 bg-red-500 text-white rounded-md sm:rounded-lg xl:rounded-xl hover:bg-red-600 transition-all duration-300 font-medium shadow-md xl:shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 text-xs sm:text-sm xl:text-base"
            >
              🗑️ Tüm Verileri Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* Ekran görüntüsü alma tuşu */}
      <div className="mt-2 sm:mt-3 xl:mt-6 p-1 sm:p-2 xl:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-md sm:rounded-lg xl:rounded-xl border border-blue-200">
        <div className="text-center">
          <h4 className="font-semibold text-blue-800 mb-1 sm:mb-2 xl:mb-3 text-xs sm:text-sm xl:text-lg">📸 Puan Tablosu Paylaşımı</h4>
          <button
            onClick={captureStandingsTable}
            className="px-2 sm:px-4 xl:px-6 py-1 sm:py-2 xl:py-3 bg-blue-500 text-white rounded-md sm:rounded-lg xl:rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium shadow-md xl:shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 text-xs sm:text-sm xl:text-base"
          >
              📸 Puan Tablosu Ekran Görüntüsü Al
          </button>
        </div>
      </div>
    </div>
  );
}
