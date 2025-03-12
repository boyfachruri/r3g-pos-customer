"use client";

import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Search...",
  defaultValue = "",
  onSearch,
}) => {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query);
    }, 500); // Debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  return (
    <TextField
      sx={{ borderRadius: "10px" }}
      fullWidth
      variant="outlined"
      size="small"
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Search;
