// src/App.jsx
import { useState, useEffect } from "react";
import Matchday from "./components/Matchday";
import Standings from "./components/Standings";
import { fixtureData, allTeams } from "./data/fixtureData";

export default function App() {
  const [matchdays, setMatchdays] = useState(fixtureData);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [standings, setStandings] = useState([]);

  const updateScore = (weekIndex, matchIndex, type, value) => {
    const updatedMatchdays = [...matchdays];
    updatedMatchdays[weekIndex].matches[matchIndex][type] = value ? parseInt(value) : null;
    setMatchdays(updatedMatchdays);
  };

  const calculateStandings = () => {
    let table = {};
    
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
      week.matches.forEach(match => {
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

    // Puan, gol farkı ve gol sayısına göre sırala
    const sortedStandings = Object.entries(table).sort((a, b) => {
      if (b[1].points !== a[1].points) return b[1].points - a[1].points;
      const goalDiffA = a[1].goalsFor - a[1].goalsAgainst;
      const goalDiffB = b[1].goalsFor - b[1].goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      return b[1].goalsFor - a[1].goalsFor;
    });

    setStandings(sortedStandings);
  };

  useEffect(() => {
    calculateStandings();
  }, [matchdays]);

  return (
    <div className="flex min-h-screen bg-gray-100 p-6 gap-6">
      {/* Sol Panel - Maç Haftaları */}
      <div className="w-2/3 bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentWeek(prev => Math.max(prev - 1, 0))} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={currentWeek === 0}
          >
            ← Önceki
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Matchday {matchdays[currentWeek].week}</h2>
            <p className="text-gray-600">{matchdays[currentWeek].date}</p>
          </div>
          <button 
            onClick={() => setCurrentWeek(prev => Math.min(prev + 1, matchdays.length - 1))} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={currentWeek === matchdays.length - 1}
          >
            Sonraki →
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-center space-x-2">
            {matchdays.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentWeek(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentWeek ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                title={`Matchday ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <Matchday 
          matches={matchdays[currentWeek].matches} 
          weekIndex={currentWeek} 
          updateScore={updateScore} 
        />
      </div>

      {/* Sağ Panel - Puan Tablosu */}
      <div className="w-1/3 bg-white rounded-xl shadow p-6">
        <Standings standings={standings} />
      </div>
    </div>
  );
}
