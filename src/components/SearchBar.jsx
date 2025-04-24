import React from "react";

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name, disease, or treatment"
      />
    </div>
  );
}

export default SearchBar;
