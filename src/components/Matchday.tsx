// src/components/Matchday.jsx
import { useState } from "react";
import ScoreInput from "./ScoreInput.tsx";
import TeamLogo from "./TeamLogo.tsx";

interface Match {
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  time: string;
}

interface DateGroup {
  date: string;
  matches: Match[];
}

interface Matchday {
  week: number;
  title: string;
  dateGroups: DateGroup[];
}

interface MatchdayProps {
  matchday: Matchday;
  weekIndex: number;
  updateScore: (weekIndex: number, dateGroupIndex: number, matchIndex: number, type: "homeScore" | "awayScore", value: string) => void;
  onResetWeek?: () => void;
}

export default function Matchday({ matchday, weekIndex, updateScore, onResetWeek }: MatchdayProps) {
  const [selectedDateGroup, setSelectedDateGroup] = useState<number | null>(null);

  // Tüm maçları düzleştir
  const allMatches = matchday.dateGroups.flatMap(dateGroup => dateGroup.matches);
  const completedMatches = allMatches.filter(m => m.homeScore !== null && m.awayScore !== null).length;
  const totalMatches = allMatches.length;

  const formatTurkishDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('tr-TR', { month: 'short' });
    const dayOfWeek = date.toLocaleString('tr-TR', { weekday: 'short' });
    return `${dayOfWeek} ${day} ${month}`;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', { weekday: 'long' });
  };

  return (
    <div className="space-y-3 sm:space-y-6 xl:space-y-8">
      {/* İlerleme çubuğu - responsive tasarım */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl xl:rounded-2xl p-2 sm:p-4 xl:p-6 border border-blue-200">
        <div className="text-center">
          <h4 className="font-semibold text-blue-800 text-xs sm:text-base xl:text-xl mb-1 sm:mb-2 xl:mb-3">📊 Tahmin İlerlemesi</h4>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 xl:h-4 mb-1 sm:mb-2 xl:mb-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 sm:h-3 xl:h-4 rounded-full transition-all duration-500"
              style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm xl:text-base text-blue-700">
            {completedMatches} / {totalMatches} maç tahmin edildi • {totalMatches - completedMatches} maç kaldı
          </p>
        </div>
      </div>

      {/* Maç günü seçimi */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl xl:rounded-2xl p-2 sm:p-4 xl:p-6 border border-purple-200">
        <h4 className="font-semibold text-purple-800 text-xs sm:text-base xl:text-xl mb-2 sm:mb-3 xl:mb-4 text-center">📅 Maç Günü Seçimi</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 xl:gap-4">
          {matchday.dateGroups.map((dateGroup, dateGroupIndex) => {
            const dayCompletedMatches = dateGroup.matches.filter(m => m.homeScore !== null && m.awayScore !== null).length;
            const dayTotalMatches = dateGroup.matches.length;
            const isSelected = selectedDateGroup === dateGroupIndex;
            
            return (
              <button
                key={dateGroupIndex}
                onClick={() => setSelectedDateGroup(isSelected ? null : dateGroupIndex)}
                className={`p-2 sm:p-3 xl:p-4 rounded-lg xl:rounded-xl border transition-all duration-300 font-medium text-xs sm:text-sm xl:text-base ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg xl:shadow-xl scale-105' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold mb-1">{dateGroupIndex + 1}. Gün</div>
                  <div className="text-xs opacity-80">{formatTurkishDate(dateGroup.date)}</div>
                  <div className="mt-1 text-xs">
                    {dayCompletedMatches}/{dayTotalMatches} maç
                  </div>
                  {dayCompletedMatches === dayTotalMatches && dayTotalMatches > 0 && (
                    <div className="mt-1 text-xs">✅ Tamamlandı</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seçili günün maçları */}
      {selectedDateGroup !== null && (
        <div className="space-y-2 sm:space-y-3 xl:space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl xl:rounded-2xl p-2 sm:p-4 xl:p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3 xl:mb-4">
              <h4 className="font-semibold text-blue-800 text-sm sm:text-lg xl:text-xl">
                {formatTurkishDate(matchday.dateGroups[selectedDateGroup].date)}
              </h4>
              <button
                onClick={() => setSelectedDateGroup(null)}
                className="text-blue-600 hover:text-blue-800 text-sm sm:text-base xl:text-lg"
              >
                ✕ Kapat
              </button>
            </div>
            
            {/* Maçlar - Grid layout ile 2 sütun (mobilde de) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 xl:gap-4">
              {matchday.dateGroups[selectedDateGroup].matches.map((match, matchIndex) => (
                <div key={matchIndex} className="bg-gradient-to-r from-gray-50 to-white rounded-xl xl:rounded-2xl p-2 sm:p-3 xl:p-4 border border-gray-200 hover:shadow-lg xl:hover:shadow-xl transition-all duration-300 hover:scale-[1.02] xl:hover:scale-[1.01] hover:-translate-y-1">
                  {/* Maç zamanı - üstte */}
                  <div className="text-center mb-2 sm:mb-3">
                    <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium">🕐 {match.time}</span>
                    </div>
                  </div>

                  {/* Takım ve skor layout - kompakt */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Ev sahibi takım */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <TeamLogo teamName={match.home} size="sm" />
                        <span className="font-semibold text-gray-800 text-xs sm:text-sm xl:text-base truncate">{match.home}</span>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <ScoreInput 
                          value={match.homeScore} 
                          onChange={(e) => updateScore(weekIndex, selectedDateGroup, matchIndex, "homeScore", e.target.value)} 
                        />
                      </div>
                    </div>

                    {/* VS göstergesi - her ekranda */}
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        <span className="text-xs font-medium">VS</span>
                      </div>
                    </div>

                    {/* Deplasman takımı */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <TeamLogo teamName={match.away} size="sm" />
                        <span className="font-semibold text-gray-800 text-xs sm:text-sm xl:text-base truncate">{match.away}</span>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <ScoreInput 
                          value={match.awayScore} 
                          onChange={(e) => updateScore(weekIndex, selectedDateGroup, matchIndex, "awayScore", e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Tahmin durumu - kompakt */}
                  <div className="mt-2 sm:mt-3 text-center">
                    {match.homeScore !== null && match.awayScore !== null ? (
                      <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <span className="text-xs">✅ {match.homeScore} - {match.awayScore}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        <span className="text-xs">⏳ Bekleniyor</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hafta sıfırlama butonu */}
      {onResetWeek && (
        <div className="mt-4 sm:mt-6 xl:mt-8 text-center">
          <button
            onClick={onResetWeek}
            className="px-4 sm:px-6 xl:px-8 py-2 sm:py-3 xl:py-4 bg-orange-500 text-white rounded-xl xl:rounded-2xl hover:bg-orange-600 transition-all duration-300 font-medium shadow-lg xl:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 text-sm sm:text-base xl:text-lg"
          >
            🔄 Bu Haftayı Sıfırla
          </button>
        </div>
      )}
    </div>
  );
}
