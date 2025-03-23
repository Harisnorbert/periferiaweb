import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import "./Regisztracio.css";

const Regisztracio = () => {
  const [form, setForm] = useState({
    nev: "",
    irsz: "",
    varos: "",
    utcaHazszam: "",
    telefon: "",
    email: "",
    jelszo: "",
  });

  const [jelszoUjra, setJelszoUjra] = useState("");
  const [jelszoLathato, setJelszoLathato] = useState(false);
  const [jelszoUjraLathato, setJelszoUjraLathato] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.jelszo !== jelszoUjra) {
      alert("A megadott jelszavak nem egyeznek!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/felhasznalo/regisztracio", form);
      alert(response.data.message);
      navigate("/bejelentkezes");
    } catch (error) {
      alert(error.response?.data?.message || "Regisztráció sikertelen!");
    }
  };

  const jelszavakEgyeznek = form.jelszo && jelszoUjra && form.jelszo === jelszoUjra;

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit} className="regisztracio-form">
      <h2>Regisztráció</h2>

      <input type="text" name="nev" placeholder="Név" onChange={handleChange} required />
      <input type="text" name="irsz" placeholder="Irányítószám" onChange={handleChange} required />
      <input type="text" name="varos" placeholder="Város" onChange={handleChange} required />
      <input type="text" name="utcaHazszam" placeholder="Utca, házszám" onChange={handleChange} required />
      <input type="text" name="telefon" placeholder="Telefonszám" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

      <div className="jelszo-container">
        <input
          type={jelszoLathato ? "text" : "password"}
          name="jelszo"
          placeholder="Jelszó"
          onChange={handleChange}
          required
        />
        <span onClick={() => setJelszoLathato(!jelszoLathato)} className="jelszo-toggle">
          {jelszoLathato ? "🙈" : "👁️"}
        </span>
      </div>

      <div className="jelszo-container">
        <input
          type={jelszoUjraLathato ? "text" : "password"}
          placeholder="Jelszó újra"
          value={jelszoUjra}
          onChange={(e) => setJelszoUjra(e.target.value)}
          required
          className={
            jelszoUjra.length > 0
              ? jelszavakEgyeznek
                ? "input-ok"
                : "input-error"
              : ""
          }
        />
        <span onClick={() => setJelszoUjraLathato(!jelszoUjraLathato)} className="jelszo-toggle">
          {jelszoUjraLathato ? "Hide" : "Show"}
        </span>
      </div>

      <button type="submit">Regisztráció</button>
    </form>
    </div>
  );
};

export default Regisztracio;
