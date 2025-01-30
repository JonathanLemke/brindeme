"use client";

interface FilterProps {
  minPrice: string;
  maxPrice: string;
  onFilterChange: (key: string, value: string) => void;
}

const Filter: React.FC<FilterProps> = ({ minPrice, maxPrice, onFilterChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <input
        type="number"
        placeholder="Preço mínimo"
        value={minPrice}
        className="p-2 border rounded w-1/3"
        onChange={(e) => onFilterChange("minPrice", e.target.value)}
      />
      <input
        type="number"
        placeholder="Preço máximo"
        value={maxPrice}
        className="p-2 border rounded w-1/3"
        onChange={(e) => onFilterChange("maxPrice", e.target.value)}
      />
    </div>
  );
};

export default Filter;
