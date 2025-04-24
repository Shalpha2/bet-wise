import React from "react";

function SortBar({ setSortField }) {
  return (
    <div className="form-group">
      <select
        className="form-select"
        onChange={(e) => setSortField(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="name">Name</option>
        <option value="disease">Disease</option>
        <option value="pathogenicity">Pathogenicity</option>
      </select>
    </div>
  );
}
export default SortBar;
