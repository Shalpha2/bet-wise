import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Alert, Spinner, ListGroup, Badge } from "react-bootstrap";

function MicrobeProfile() {
  const { id } = useParams();
  const [microbe, setMicrobe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMicrobe = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/microbes/${id}`);
        if (!response.ok) throw new Error('Failed to fetch microbe');
        const data = await response.json();
        setMicrobe(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMicrobe();
  }, [id]);

  if (loading && !microbe) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/microbes" className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    );
  }

  if (!microbe) return null;

  return (
    <div className="container mt-5">
      <Link to="/microbes" className="btn btn-secondary mb-4">
        ← Back to List
      </Link>
      
      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{microbe.name}</h2>
          <Badge bg={getTypeBadgeColor(microbe.type)}>
            {microbe.type}
          </Badge>
        </div>
        
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Disease:</strong> {microbe.disease}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Classification:</strong> {microbe.classification || 'N/A'}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Pathogenicity:</strong> {microbe.pathogenicity || 'N/A'}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Symptoms:</strong> {microbe.symptoms || 'N/A'}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Treatment:</strong> {microbe.treatment || 'N/A'}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Lab Results:</strong> {microbe.labResults || 'N/A'}
          </ListGroup.Item>
        </ListGroup>
      </div>
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

export default MicrobeProfile;
