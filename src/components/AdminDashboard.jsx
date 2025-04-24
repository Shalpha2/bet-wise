import React, { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";

function AdminDashboard() {
  const [microbes, setMicrobes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    disease: "",
    type: "Bacteria",
    pathogenicity: "",
    treatment: "",
    symptoms: "",
    labResults: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchMicrobes();
  }, []);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId 
        ? `http://localhost:3000/microbes/${editingId}`
        : "http://localhost:3000/microbes";
      const method = editingId ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error(editingId ? "Update failed" : "Creation failed");
      
      setSuccess(editingId ? "Microbe updated successfully!" : "Microbe added successfully!");
      setFormData({ 
        name: "", 
        disease: "", 
        type: "Bacteria", 
        pathogenicity: "", 
        treatment: "",
        symptoms: "",
        labResults: ""
      });
      setEditingId(null);
      await fetchMicrobes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };

  const handleEdit = (microbe) => {
    setFormData(microbe);
    setEditingId(microbe.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this microbe?")) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/microbes/${id}`, {
          method: "DELETE"
        });
        if (!response.ok) throw new Error("Deletion failed");
        setSuccess("Microbe deleted successfully!");
        await fetchMicrobes();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Microbe Name</label>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Microbe Name"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Associated Disease</label>
            <input
              className="form-control"
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              placeholder="Associated Disease"
              required
            />
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option>Bacteria</option>
              <option>Virus</option>
              <option>Fungus</option>
              <option>Parasite</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Pathogenicity</label>
            <input
              className="form-control"
              name="pathogenicity"
              value={formData.pathogenicity}
              onChange={handleChange}
              placeholder="Pathogenicity"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Treatment</label>
            <input
              className="form-control"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="Treatment"
            />
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Symptoms</label>
            <textarea
              className="form-control"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Symptoms"
              rows="2"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Lab Results</label>
            <textarea
              className="form-control"
              name="labResults"
              value={formData.labResults}
              onChange={handleChange}
              placeholder="Lab Results"
              rows="2"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : editingId ? (
            "Update Microbe"
          ) : (
            "Add Microbe"
          )}
        </button>
      </form>

      <h4 className="mb-3">Current Microbes</h4>
      {loading && microbes.length === 0 ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Disease</th>
                <th>Type</th>
                <th>Pathogenicity</th>
                <th>Treatment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {microbes.map((microbe) => (
                <tr key={microbe.id}>
                  <td>{microbe.name}</td>
                  <td>{microbe.disease}</td>
                  <td>
                    <span className={`badge bg-${getTypeBadgeColor(microbe.type)}`}>
                      {microbe.type}
                    </span>
                  </td>
                  <td>{microbe.pathogenicity}</td>
                  <td>{microbe.treatment}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(microbe)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(microbe.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default AdminDashboard;
