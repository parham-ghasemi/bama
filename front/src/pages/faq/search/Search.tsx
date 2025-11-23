import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

type Category = {
  title: string;
  img: string;
};

interface SearchProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ categories, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm }) => {
  const allCategories = "همه دسته بندی ها";
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const selected = selectedCategory || allCategories;

  const placeholderText = selectedCategory
    ? `جست و جو در بین سوالات ${selectedCategory}`
    : 'جست و جو در بین سوالات';

  return (
    <div className="rounded-lg px-7 py-3 border border-neutral-400 flex gap-5 items-center justify-between w-3xl">
      <div className="flex gap-3 items-center">
        <CiSearch size={20} className="text-yellow-600" />
        <input
          type="text"
          className="w-96 placeholder:text-neutral-400 h-full outline-none"
          placeholder={placeholderText}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div ref={dropdownRef} className="border rounded-lg border-neutral-400 py-1 flex items-center gap-7 cursor-pointer relative" onClick={() => setOpen(!open)}>
        <p className="px-3">{selected}</p>
        <FaChevronDown className="px-3 border-r border-neutral-400" size={40} />
        <div className={`absolute top-full left-0 bg-white border border-neutral-400 rounded-lg mt-1 w-full z-10 transition-all duration-200 ease-in-out origin-top ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div
            className="px-3 py-1 cursor-pointer hover:bg-neutral-100"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCategory(null);
              setOpen(false);
            }}
          >
            {allCategories}
          </div>
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="px-3 py-1 cursor-pointer hover:bg-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCategory(cat.title);
                setOpen(false);
              }}
            >
              {cat.title}
            </div>
          ))}
        </div>
      </div>

      <button className="bg-neutral-800 rounded-lg p-1.5">
        <CiSearch size={25} className="text-white" />
      </button>
    </div>
  )
}

export default Search