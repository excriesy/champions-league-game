// src/components/ScoreInput.jsx
interface ScoreInputProps {
  value: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function ScoreInput({ value, onChange, placeholder = "0" }: ScoreInputProps) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Eğer değer null ise, odaklanınca 0 yap
    if (value === null) {
      e.target.value = "0";
      onChange(e);
    }
  };

  return (
    <input
      type="number"
      min="0"
      max="20"
      value={value || ""}
      onChange={onChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      className="w-16 h-12 xl:w-20 xl:h-16 text-center text-lg xl:text-2xl font-bold border-2 border-gray-300 rounded-lg xl:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 xl:focus:ring-4 focus:ring-blue-200 xl:focus:ring-blue-300 transition-all duration-300 hover:border-blue-400 hover:shadow-md xl:hover:shadow-lg hover:scale-105 xl:hover:scale-110 score-input"
    />
  );
}
