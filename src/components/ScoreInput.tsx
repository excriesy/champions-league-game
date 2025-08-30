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
      className="w-10 h-8 sm:w-12 sm:h-10 md:w-16 md:h-12 text-center text-sm sm:text-base md:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
    />
  );
}
