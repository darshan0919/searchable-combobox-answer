const OPTIONS = [
  { id: "apple", label: "Apple" },
  { id: "apricot", label: "Apricot" },
  { id: "banana", label: "Banana" },
  { id: "blueberry", label: "Blueberry" },
  { id: "cherry", label: "Cherry" },
  { id: "grape", label: "Grape" },
  { id: "mango", label: "Mango" },
  { id: "orange", label: "Orange" },
];

const SEARCH_DELAY_MS = 300;

export function searchOptions(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();
      const results = normalizedQuery
        ? OPTIONS.filter((option) =>
            option.label.toLowerCase().includes(normalizedQuery),
          )
        : OPTIONS.slice();

      resolve(results);
    }, SEARCH_DELAY_MS);
  });
}
