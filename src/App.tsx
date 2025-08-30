import { useState, useEffect } from "react";
import Matchday from "./components/Matchday.tsx";
import Standings from "./components/Standings.tsx";
import { fixtureData, allTeams } from "./data/fixtureData.ts";
import "./App.css";

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

interface TeamStats {
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

// LocalStorage key'leri
const STORAGE_KEYS = {
  MATCHDAYS: "champions_league_matchdays",
  CURRENT_WEEK: "champions_league_current_week"
};

export default function App() {
  const [matchdays, setMatchdays] = useState(fixtureData);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [standings, setStandings] = useState<[string, TeamStats][]>([]);

  // Sayfa yüklendiğinde localStorage'dan veri al
  useEffect(() => {
    const savedMatchdays = localStorage.getItem(STORAGE_KEYS.MATCHDAYS);
    const savedCurrentWeek = localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK);
    
    if (savedMatchdays) {
      try {
        const parsed = JSON.parse(savedMatchdays);
        setMatchdays(parsed);
      } catch (error) {
        console.log("Kayıtlı veri bulunamadı, varsayılan veri kullanılıyor");
      }
    }
    
    if (savedCurrentWeek) {
      setCurrentWeek(parseInt(savedCurrentWeek));
    }
  }, []);

  // Veri değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHDAYS, JSON.stringify(matchdays));
  }, [matchdays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, currentWeek.toString());
  }, [currentWeek]);

  const updateScore = (weekIndex: number, dateGroupIndex: number, matchIndex: number, type: "homeScore" | "awayScore", value: string) => {
    const updatedMatchdays = [...matchdays];
    const match = updatedMatchdays[weekIndex].dateGroups[dateGroupIndex].matches[matchIndex];
    if (match) {
      let numValue: number | null = null;
      if (value) {
        const parsed = parseInt(value);
        numValue = isNaN(parsed) ? null : parsed;
      }
      
      if (type === "homeScore") {
        (match as any).homeScore = numValue;
      } else {
        (match as any).awayScore = numValue;
      }
      setMatchdays(updatedMatchdays);
    }
  };

  const calculateStandings = () => {
    let table: { [key: string]: TeamStats } = {};
    
    // Tüm takımları başlangıçta ekle
    allTeams.forEach(team => {
      table[team] = { 
        points: 0, 
        played: 0, 
        wins: 0, 
        draws: 0, 
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0
      };
    });

    matchdays.forEach(week => {
      week.dateGroups.forEach(dateGroup => {
        dateGroup.matches.forEach((match: Match) => {
          if (match.homeScore !== null && match.awayScore !== null) {
            table[match.home].played++;
            table[match.away].played++;
            
            table[match.home].goalsFor += match.homeScore;
            table[match.home].goalsAgainst += match.awayScore;
            table[match.away].goalsFor += match.awayScore;
            table[match.away].goalsAgainst += match.homeScore;

            if (match.homeScore > match.awayScore) {
              table[match.home].points += 3;
              table[match.home].wins++;
              table[match.away].losses++;
            } else if (match.homeScore < match.awayScore) {
              table[match.away].points += 3;
              table[match.away].wins++;
              table[match.home].losses++;
            } else {
              table[match.home].points++;
              table[match.away].points++;
              table[match.home].draws++;
              table[match.away].draws++;
            }
          }
        });
      });
    });

    // Puan, gol farkı ve gol sayısına göre sırala (FIFA sıralama kriterleri)
    const sortedStandings = Object.entries(table).sort((a, b) => {
      // 1. Önce puana göre sırala
      if (b[1].points !== a[1].points) return b[1].points - a[1].points;
      
      // 2. Puan eşitse gol farkına göre sırala
      const goalDiffA = a[1].goalsFor - a[1].goalsAgainst;
      const goalDiffB = b[1].goalsFor - b[1].goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      
      // 3. Gol farkı eşitse atılan gol sayısına göre sırala
      if (b[1].goalsFor !== a[1].goalsFor) return b[1].goalsFor - a[1].goalsFor;
      
      // 4. Atılan gol eşitse yenen gol sayısına göre sırala (az olan önde)
      if (a[1].goalsAgainst !== b[1].goalsAgainst) return a[1].goalsAgainst - b[1].goalsAgainst;
      
      // 5. Son olarak takım adına göre alfabetik sırala
      return a[0].localeCompare(b[0]);
    });

    setStandings(sortedStandings);
  };

  useEffect(() => {
    calculateStandings();
  }, [matchdays]);

  const resetData = () => {
    if (confirm("Tüm skor tahminleriniz silinecek. Emin misiniz?")) {
      setMatchdays(fixtureData);
      setCurrentWeek(0);
      localStorage.removeItem(STORAGE_KEYS.MATCHDAYS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_WEEK);
    }
  };

  const resetCurrentWeek = () => {
    if (confirm(`${matchdays[currentWeek].title} için tüm skor tahminleri silinecek. Emin misiniz?`)) {
      const updatedMatchdays = [...matchdays];
      updatedMatchdays[currentWeek] = fixtureData[currentWeek];
      setMatchdays(updatedMatchdays);
      localStorage.setItem(STORAGE_KEYS.MATCHDAYS, JSON.stringify(updatedMatchdays));
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header - mobil için kompakt */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 sm:p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <img src="/logo/ucl.png" alt="UCL Logo" className="w-8 h-8 sm:w-12 sm:h-12" />
          <h1 className="text-lg sm:text-3xl font-bold text-center">
            Şampiyonlar Ligi Skor Tahmini 
          </h1>
          <img src="/logo/ucl.png" alt="UCL Logo" className="w-8 h-8 sm:w-12 sm:h-12" />
        </div>
      </div>

      {/* Ana içerik - mobil için optimize */}
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Sol panel - Maç programı */}
          <div className="flex-1 min-w-0 xl:mr-4">
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6 border border-gray-200">
              {/* Hafta navigasyonu - mobil için kompakt */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button
                  onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                  disabled={currentWeek === 0}
                  className="px-2 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs sm:text-sm"
                >
                  ← Önceki
                </button>
                
                <div className="text-center">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">{matchdays[currentWeek].title}</h2>
                  <p className="text-xs sm:text-sm text-gray-600">{matchdays[currentWeek].week}. Hafta</p>
                </div>
                
                <button
                  onClick={() => setCurrentWeek(Math.min(matchdays.length - 1, currentWeek + 1))}
                  disabled={currentWeek === matchdays.length - 1}
                  className="px-2 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs sm:text-sm"
                >
                  Sonraki →
                </button>
              </div>
              
              {/* Hafta göstergeleri - mobil için kompakt */}
              <div className="flex justify-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
                {matchdays.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentWeek(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                      index === currentWeek 
                        ? 'bg-blue-500 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <Matchday 
                matchday={matchdays[currentWeek]} 
                weekIndex={currentWeek} 
                updateScore={updateScore}
                onResetWeek={resetCurrentWeek}
              />
            </div>
          </div>
          
          {/* Sağ panel - Puan tablosu - mobilde alt kısımda */}
          <div className="xl:w-[680px] flex-shrink-0 order-first xl:order-last">
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6 border border-gray-200 xl:sticky xl:top-8">
              <Standings 
                standings={standings} 
                onResetAll={resetData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
