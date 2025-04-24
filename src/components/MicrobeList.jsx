import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import SortBar from "./SortBar";
import { Alert, Spinner, Card, Badge } from "react-bootstrap";

function MicrobeList() {
  const [microbes, setMicrobes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMicrobes = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/microbes");
        if (!res.ok) throw new Error("Failed to fetch microbes");
        const data = await res.json();
        setMicrobes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMicrobes();
  }, []);

  let filtered = microbes.filter((microbe) => {
    const matchesSearch = 
      microbe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      microbe.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (microbe.treatment && microbe.treatment.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "All" || microbe.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (sortField) {
    filtered.sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      return aValue.localeCompare(bValue);
    });
  }

  const handleCardClick = (id) => {
    navigate(`/microbe/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Microbe Directory</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="d-flex justify-content-between mb-4">
        <FilterBar selectedType={selectedType} setSelectedType={setSelectedType} />
        <SortBar setSortField={setSortField} />
      </div>

      {loading && microbes.length === 0 ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="row">
          {filtered.length === 0 ? (
            <div className="col-12">
              <Alert variant="info">No microbes found matching your criteria</Alert>
            </div>
          ) : (
            filtered.map((microbe) => (
              <div key={microbe.id} className="col-md-4 mb-4">
                <Card 
                  className="h-100 shadow-sm cursor-pointer"
                  onClick={() => handleCardClick(microbe.id)}
                >
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                      {microbe.name}
                      <Badge bg={getTypeBadgeColor(microbe.type)}>
                        {microbe.type}
                      </Badge>
                    </Card.Title>
                    <Card.Text>
                      <strong>Disease:</strong> {microbe.disease}<br />
                      <strong>Pathogenicity:</strong> {microbe.pathogenicity || 'N/A'}<br />
                      <strong>Treatment:</strong> {microbe.treatment || 'N/A'}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-transparent">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(microbe.id);
                      }}
                    >
                      View Details
                    </button>
                  </Card.Footer>
                </Card>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function getTypeBadgeColor(type) {
  switch(type) {
    case 'Bacteria': return 'info';
    case 'Virus': return 'warning';
    case 'Fungus': return 'success';
    case 'Parasite': return 'danger';
    default: return 'secondary';
  }
}

export default MicrobeList;
