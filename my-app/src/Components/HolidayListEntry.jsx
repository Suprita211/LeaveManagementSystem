import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const {API_URL_PROD} = process.env;
const AddHoliday = () => {
  const [formData, setFormData] = useState({
    date: "",
    occasion: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.date || !formData.occasion) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(`https://ems-be-v1.onrender.com/api/leave1/holidays`, formData);
      if (response.data.success) {
        alert("Holiday added successfully!");
        
        // Reset form
        setFormData({ date: "", occasion: "" });

        // Refresh page (optional)
        window.location.reload();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error adding holiday:", error);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Add Holiday</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Occasion:</label>
        <input type="text" name="occasion" value={formData.occasion} onChange={handleChange} required />

        <button type="submit" style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}>Submit</button>
      </form>
    </div>
  );
};

export default AddHoliday;
