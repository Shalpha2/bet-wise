import React from "react";

function FilterBar({ selectedType, setSelectedType }) {
  return (
    <div className="form-group">
      <select
        className="form-select"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="All">All Types</option>
        <option value="Bacteria">Bacteria</option>
        <option value="Virus">Virus</option>
        <option value="Fungus">Fungus</option>
        <option value="Parasite">Parasite</option>
      </select>
    </div>
  );
}

export default FilterBar;
