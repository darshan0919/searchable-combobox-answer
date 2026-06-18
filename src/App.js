import SearchableCombobox from "./components/SearchableCombobox/SearchableCombobox";
import "./App.css";

export default function App() {
  return (
    <main className="app">
      <h1>Searchable Combobox</h1>
      <p className="app__hint">Type to search and select an option.</p>
      <SearchableCombobox />
    </main>
  );
}
