import { useState, useEffect } from "react";
import { searchOptions } from "./mockSearch";
import { getFocusedIndex } from "./getFocusedIndex";
import "./SearchableCombobox.css";

const DEBOUNCE_MS = 300;

export default function SearchableCombobox() {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // --- Milestone 1: Fetch and show results ---
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  // --- Milestone 2: Debounce search (300ms) ---
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      searchOptions(query)
        .then((results) => {
          setOptions(results);
          setFocusedIndex(0);
        })
        .finally(() => {
          setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  // --- Milestone 3: Keyboard navigation ---
  const handleKeyDown = (event) => {
    if (!isOpen || options.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((current) =>
        getFocusedIndex(current, options.length, "down"),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((current) =>
        getFocusedIndex(current, options.length, "up"),
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = options[focusedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  // --- Milestone 4: Select and empty state ---
  const handleSelect = (option) => {
    setQuery(option.label);
    setIsOpen(false);
    setOptions([]);
    setFocusedIndex(0);
  };

  const showList =
    isOpen && (loading || options.length > 0 || query.length > 0);
  const showEmpty = !loading && options.length === 0 && query.length > 0;

  return (
    <div className="combobox">
      <input
        type="text"
        className="combobox__input"
        data-testid="combobox-input"
        value={query}
        placeholder="Select an option"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />

      {showList && (
        <ul
          className="combobox__list"
          data-testid="combobox-list"
          role="listbox"
        >
          {loading && (
            <li className="combobox__status" data-testid="combobox-loading">
              Loading...
            </li>
          )}

          {!loading &&
            options.map((option, index) => (
              <li
                key={option.id}
                className="combobox__option"
                data-testid={`combobox-option-${option.id}`}
                data-active={index === focusedIndex ? "true" : "false"}
                role="option"
                aria-selected={index === focusedIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}

          {showEmpty && (
            <li
              className="combobox__status combobox__status--empty"
              data-testid="combobox-empty"
            >
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
