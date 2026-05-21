import { Filter, ChevronDown } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const CATEGORIES = [
  "All Categories",
  "IT & Software",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Engineering",
  "Marketing & Sales",
  "NGO",
  "Other",
];

const LOCATIONS = [
  "All Locations",
  "Dar es Salaam",
  "Arusha",
  "Mwanza",
  "Dodoma",
  "Zanzibar",
  "Remote",
];

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-8 bg-white p-4 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold mr-2">
        <Filter className="w-4 h-4" />
        Filters:
      </div>
      
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
