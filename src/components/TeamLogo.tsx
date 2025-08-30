interface TeamLogoProps {
  teamName: string;
  size?: "sm" | "md" | "lg";
}

export default function TeamLogo({ teamName, size = "md" }: TeamLogoProps) {
  // Takım adına göre logo dosya adı belirle
  const getLogoPath = (name: string) => {
    const logoMap: { [key: string]: string } = {
      "Arsenal": "arsenal.png",
      "Athletic Bilbao": "bilbao.png", 
      "PSV": "psv.png",
      "Union Saint-Gilloise": "usg.png",
      "Juventus": "juventus.png",
      "Borussia Dortmund": "dortmund.png",
      "Real Madrid": "real madrid.png",
      "Marsilya": "marsilya.png",
      "Benfica": "benfica.png",
      "Karabağ": "karabağ.png",
      "Tottenham": "tottenham.png",
      "Villarreal": "villareal.png",
      "Club Brugge": "brugge.png",
      "Monaco": "monaco.png",
      "Kopenhag": "kopenhag.png",
      "Bayer Leverkusen": "leverkusen.png",
      "Eintracht Frankfurt": "frankfurt.png",
      "Galatasaray": "galatasaray.webp",
      "Manchester City": "manchester city.png",
      "Napoli": "napoli.webp",
      "Newcastle": "newcastle utd.png",
      "Barcelona": "barcelona.png",
      "Sporting CP": "sporting lizbon.png",
      "Kairat": "kairat.png",
      "Ajax": "ajax.webp",
      "Inter Milan": "inter.png",
      "Bayern Münih": "bayern münih.png",
      "Chelsea": "chelsea.png",
      "Liverpool": "liverpool.png",
      "Atletico Madrid": "atletico madrid.png",
      "PSG": "psg.png",
      "Atalanta": "atalanta.png",
      "Olympiacos": "olympiakos.webp",
      "Pafos": "pafos.png",
      "Slavia Prague": "slavia prag.png",
      "Bodo/Glimt": "bodo.png"
    };

    return logoMap[name] || "ucl.png"; // Varsayılan olarak UCL logosu
  };

  const logoPath = getLogoPath(teamName);
  
  const sizeClasses = {
    sm: "w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8",
    md: "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10",
    lg: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
  };

  return (
    <img 
      src={`/logo/${logoPath}`}
      alt={`${teamName} logo`}
      className={`${sizeClasses[size]} object-contain rounded-full border-2 border-white shadow-sm flex-shrink-0`}
      onError={(e) => {
        // Logo yüklenemezse UCL logosunu göster
        const target = e.target as HTMLImageElement;
        target.src = "/logo/ucl.png";
      }}
    />
  );
} 