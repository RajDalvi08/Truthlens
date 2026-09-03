import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext({
  searchQuery: "",
  setSearchQuery: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
});

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const value = {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}
