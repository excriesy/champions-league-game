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
    const month = date.toLocaleString('tr-TR', { month: 'long' });
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleString('tr-TR', { weekday: 'long' });
    return `${dayOfWeek} ${day} ${month} ${year}`;
  };

  return (
    <div className="space-y-6 xl:space-y-8">
      {/* İlerleme çubuğu */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl xl:rounded-2xl p-4 xl:p-6 border border-blue-200">
        <div className="text-center">
          <h4 className="font-semibold text-blue-800 mb-2 xl:mb-3 text-lg xl:text-xl">📊 Tahmin İlerlemesi</h4>
          <div className="w-full bg-gray-200 rounded-full h-3 xl:h-4 mb-2 xl:mb-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 xl:h-4 rounded-full transition-all duration-500"
              style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm xl:text-base text-blue-700">
            {completedMatches} / {totalMatches} maç tahmin edildi • {totalMatches - completedMatches} maç kaldı
          </p>
        </div>
      </div>

      {/* Maç grupları */}
      <div className="space-y-6 xl:space-y-8">
        {matchday.dateGroups.map((dateGroup, dateGroupIndex) => (
          <div key={dateGroupIndex} className="space-y-4 xl:space-y-6">
            {/* Tarih başlığı - tıklanabilir */}
            <button
              onClick={() => toggleDateGroup(dateGroupIndex)}
              className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl xl:rounded-2xl p-4 xl:p-6 border border-blue-200 hover:shadow-lg xl:hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] xl:hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg xl:text-xl font-semibold text-blue-800">{formatTurkishDate(dateGroup.date)}</h4>
                <div className="flex items-center space-x-2 xl:space-x-3">
                  <span className="text-sm xl:text-base text-blue-600 bg-blue-100 px-2 xl:px-3 py-1 xl:py-2 rounded-full">
                    {dateGroup.matches.length} maç
                  </span>
                  <div className={`transform transition-transform duration-300 ${collapsedDates.has(dateGroupIndex) ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
              </div>
            </button>
            
            {/* Maçlar - açılıp kapanabilir */}
            {!collapsedDates.has(dateGroupIndex) && (
              <div className="space-y-4 xl:space-y-6 pl-4 xl:pl-6">
                {dateGroup.matches.map((match, matchIndex) => (
                  <div key={matchIndex} className="bg-gradient-to-r from-gray-50 to-white rounded-xl xl:rounded-2xl p-4 sm:p-8 xl:p-10 border border-gray-200 hover:shadow-xl xl:hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] xl:hover:scale-[1.01] hover:-translate-y-1 xl:hover:-translate-y-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between min-w-0 space-y-4 sm:space-y-0">
                      {/* Ev sahibi takım */}
                      <div className="flex-1 text-center sm:text-right sm:pr-8 xl:pr-12 min-w-0 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 xl:space-x-6">
                          <TeamLogo teamName={match.home} size="md" />
                          <span className="font-bold text-gray-800 text-base sm:text-lg xl:text-xl whitespace-nowrap">{match.home}</span>
                        </div>
                      </div>
                      
                      {/* Skor girişi */}
                      <div className="flex items-center space-x-3 sm:space-x-4 xl:space-x-6 bg-white px-4 sm:px-8 xl:px-10 py-3 sm:py-6 xl:py-8 rounded-xl xl:rounded-2xl border-2 border-gray-200 shadow-sm xl:shadow-md mx-2 sm:mx-6 xl:mx-8 flex-shrink-0">
                        <ScoreInput 
                          value={match.homeScore} 
                          onChange={(e) => updateScore(weekIndex, dateGroupIndex, matchIndex, "homeScore", e.target.value)} 
                        />
                        <div className="text-center">
                          <span className="text-xl sm:text-2xl xl:text-3xl font-bold text-gray-400">-</span>
                          <div className="text-xs sm:text-sm xl:text-base text-gray-500 mt-1 sm:mt-2 xl:mt-3">VS</div>
                          <div className="text-xs sm:text-sm xl:text-base text-blue-600 font-medium">{match.time}</div>
                        </div>
                        <ScoreInput 
                          value={match.awayScore} 
                          onChange={(e) => updateScore(weekIndex, dateGroupIndex, matchIndex, "awayScore", e.target.value)} 
                        />
                      </div>
                      
                      {/* Deplasman takımı */}
                      <div className="flex-1 text-center sm:text-left sm:pl-8 xl:pl-12 min-w-0 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 xl:space-x-6">
                          <span className="font-bold text-gray-800 text-base sm:text-lg xl:text-xl whitespace-nowrap">{match.away}</span>
                          <TeamLogo teamName={match.away} size="md" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Tahmin durumu */}
                    <div className="mt-4 xl:mt-6 text-center">
                      {match.homeScore !== null && match.awayScore !== null ? (
                        <div className="inline-flex items-center space-x-2 xl:space-x-3 bg-green-100 text-green-800 px-4 xl:px-6 py-2 xl:py-3 rounded-full xl:rounded-xl">
                          <span className="text-sm xl:text-base">✅ Tahmin Tamamlandı</span>
                          <span className="text-xs xl:text-sm font-medium">{match.homeScore} - {match.awayScore}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-2 xl:space-x-3 bg-yellow-100 text-yellow-800 px-4 xl:px-6 py-2 xl:py-3 rounded-full xl:rounded-xl">
                          <span className="text-sm xl:text-base">⏳ Tahmin Bekleniyor</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hafta sıfırlama butonu */}
      {onResetWeek && (
        <div className="mt-6 xl:mt-8 text-center">
          <button
            onClick={onResetWeek}
            className="px-6 xl:px-8 py-3 xl:py-4 bg-orange-500 text-white rounded-xl xl:rounded-2xl hover:bg-orange-600 transition-all duration-300 font-medium shadow-lg xl:shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 text-base xl:text-lg"
          >
            🔄 Bu Haftayı Sıfırla
          </button>
        </div>
      )}
    </div>
  );
}
