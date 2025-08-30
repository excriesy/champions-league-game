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
  const [collapsedDates, setCollapsedDates] = useState<Set<number>>(new Set());

  // Tüm maçları düzleştir
  const allMatches = matchday.dateGroups.flatMap(dateGroup => dateGroup.matches);
  const completedMatches = allMatches.filter(m => m.homeScore !== null && m.awayScore !== null).length;
  const totalMatches = allMatches.length;

  const toggleDateGroup = (dateGroupIndex: number) => {
    const newCollapsed = new Set(collapsedDates);
    if (newCollapsed.has(dateGroupIndex)) {
      newCollapsed.delete(dateGroupIndex);
    } else {
      newCollapsed.add(dateGroupIndex);
    }
    setCollapsedDates(newCollapsed);
  };

  const formatTurkishDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('tr-TR', { month: 'short' });
    const dayOfWeek = date.toLocaleString('tr-TR', { weekday: 'short' });
    return `${dayOfWeek} ${day} ${month}`;
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

      {/* Maç grupları */}
      <div className="space-y-2 sm:space-y-3 xl:space-y-6">
        {matchday.dateGroups.map((dateGroup, dateGroupIndex) => (
          <div key={dateGroupIndex} className="space-y-2 sm:space-y-4 xl:space-y-6">
            {/* Tarih başlığı - responsive tasarım */}
            <button
              onClick={() => toggleDateGroup(dateGroupIndex)}
              className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl xl:rounded-2xl p-2 sm:p-4 xl:p-6 border border-blue-200 hover:shadow-md xl:hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] xl:hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm sm:text-lg xl:text-xl font-semibold text-blue-800">{formatTurkishDate(dateGroup.date)}</h4>
                <div className="flex items-center space-x-2 xl:space-x-3">
                  <span className="text-xs sm:text-sm xl:text-base text-blue-600 bg-blue-100 px-2 xl:px-3 py-1 xl:py-2 rounded-full">
                    {dateGroup.matches.length} maç
                  </span>
                  <div className={`transform transition-transform duration-300 ${collapsedDates.has(dateGroupIndex) ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
              </div>
            </button>
            
            {/* Maçlar - Grid layout ile 2 sütun (mobilde de) */}
            {!collapsedDates.has(dateGroupIndex) && (
              <div className="pl-2 sm:pl-4 xl:pl-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:gap-4">
                  {dateGroup.matches.map((match, matchIndex) => (
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
                              onChange={(e) => updateScore(weekIndex, dateGroupIndex, matchIndex, "homeScore", e.target.value)} 
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
                              onChange={(e) => updateScore(weekIndex, dateGroupIndex, matchIndex, "awayScore", e.target.value)} 
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
            )}
          </div>
        ))}
      </div>

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
