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
    <div className="space-y-3">
      {/* İlerleme çubuğu - mobil için kompakt */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-2 sm:p-4 border border-blue-200">
        <div className="text-center">
          <h4 className="font-semibold text-blue-800 text-xs sm:text-base mb-1 sm:mb-2">📊 Tahmin İlerlemesi</h4>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-1 sm:mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-blue-700">
            {completedMatches} / {totalMatches} maç • {totalMatches - completedMatches} kaldı
          </p>
        </div>
      </div>

      {/* Maç grupları */}
      <div className="space-y-2 sm:space-y-3">
        {matchday.dateGroups.map((dateGroup, dateGroupIndex) => (
          <div key={dateGroupIndex} className="space-y-2">
            {/* Tarih başlığı - mobil için kompakt */}
            <button
              onClick={() => toggleDateGroup(dateGroupIndex)}
              className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-2 sm:p-4 border border-blue-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm sm:text-lg font-semibold text-blue-800">{formatTurkishDate(dateGroup.date)}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {dateGroup.matches.length} maç
                  </span>
                  <div className={`transform transition-transform duration-200 ${collapsedDates.has(dateGroupIndex) ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
              </div>
            </button>
            
            {/* Maçlar - mobilde grid (2 sütun), desktop'ta tek sütun */}
            {!collapsedDates.has(dateGroupIndex) && (
              <div className="space-y-2 pl-2 sm:pl-4">
                {/* Mobilde grid layout, desktop'ta tek sütun */}
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                  {dateGroup.matches.map((match, matchIndex) => (
                    <div key={matchIndex} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-2 sm:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      {/* Maç zamanı - üstte */}
                      <div className="text-center mb-2 sm:mb-3">
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          <span className="text-xs font-medium">🕐 {match.time}</span>
                        </div>
                      </div>

                      {/* Takım ve skor layout - mobilde kompakt, desktop'ta normal */}
                      <div className="space-y-2 sm:space-y-3">
                        {/* Ev sahibi takım */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 sm:p-3">
                          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                            <TeamLogo teamName={match.home} size="sm" />
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{match.home}</span>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            <ScoreInput 
                              value={match.homeScore} 
                              onChange={(e) => updateScore(weekIndex, dateGroupIndex, matchIndex, "homeScore", e.target.value)} 
                            />
                          </div>
                        </div>

                        {/* VS göstergesi - sadece desktop'ta */}
                        <div className="hidden sm:block text-center">
                          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                            <span className="text-xs font-medium">VS</span>
                          </div>
                        </div>

                        {/* Deplasman takımı */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 sm:p-3">
                          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                            <TeamLogo teamName={match.away} size="sm" />
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{match.away}</span>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            <ScoreInput 
                              value={match.awayScore} 
                              onChange={(e) => updateScore(weekIndex, dateGroupIndex, matchIndex, "awayScore", e.target.value)} 
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Tahmin durumu - mobil için kompakt */}
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

      {/* Hafta sıfırlama butonu - mobil için kompakt */}
      {onResetWeek && (
        <div className="mt-3 sm:mt-4 text-center">
          <button
            onClick={onResetWeek}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl text-xs sm:text-base"
          >
            🔄 Bu Haftayı Sıfırla
          </button>
        </div>
      )}
    </div>
  );
}
