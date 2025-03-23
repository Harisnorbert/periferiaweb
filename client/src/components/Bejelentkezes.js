import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import "./Bejelentkezes.css";

const Bejelentkezes = ({ setFelhasznalo }) => {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [jelszoLathato, setJelszoLathato] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/felhasznalo/bejelentkezes", { email, jelszo });

      console.log("Bejelentkezés sikeres:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("felhasznalo", JSON.stringify(response.data.felhasznalo));
      setFelhasznalo(response.data.felhasznalo);

    

      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Bejelentkezési hiba:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Bejelentkezés sikertelen!");
    }
  };

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Bejelentkezés</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="jelszo-container">
        <input
          type={jelszoLathato ? "text" : "password"}
          name="jelszo"
          placeholder="Jelszó"
          value={jelszo}
          onChange={(e) => setJelszo(e.target.value)}
          required
        />
        <span onClick={() => setJelszoLathato(!jelszoLathato)} className="jelszo-toggle">
          {jelszoLathato ? "🙈" : "👁️"}
        </span>
      </div>

      <button type="submit">Bejelentkezés</button>
    </form>
    </div>
  );
};

export default Bejelentkezes;