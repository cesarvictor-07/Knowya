import { Search, X } from "lucide-react";
import "../styles/search-bar.css";

function SearchBar({
    value,
    onChange,
    placeholder = "Buscar...",
    ariaLabel = "Buscar",
}) {
    return (
        <div className="search-bar">
            <Search className="search-bar-icon" aria-hidden="true" />

            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={ariaLabel}
            />

            {value && (
                <button
                    type="button"
                    className="search-bar-clear"
                    onClick={() => onChange("")}
                    aria-label="Limpiar búsqueda"
                    title="Limpiar búsqueda"
                >
                    <X aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

export default SearchBar;

