import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
      const response = await axios.post("${process.env.REACT_APP_API_URL}/felhasznalo/regisztracio", form);
      alert(response.data.message);
      navigate("/bejelentkezes");
    } catch (error) {
      alert(error.response?.data?.message || "Regisztráció sikertelen!");
    }
  };

  const jelszavakEgyeznek = form.jelszo && jelszoUjra && form.jelszo === jelszoUjra;

  return (
    <div className="auth-form-container">
    <form onSubmit={handleSubmit} className="auth-regisztracio-form">
      <h2>Regisztráció</h2>

      <input type="text" name="nev" placeholder="Név" onChange={handleChange} required />
      <input type="text" name="irsz" placeholder="Irányítószám" onChange={handleChange} required />
      <input type="text" name="varos" placeholder="Város" onChange={handleChange} required />
      <input type="text" name="utcaHazszam" placeholder="Utca, házszám" onChange={handleChange} required />
      <input type="text" name="telefon" placeholder="Telefonszám" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

      <div className="auth-password-toggle">
        <input
          type={jelszoLathato ? "text" : "password"}
          name="jelszo"
          placeholder="Jelszó"
          onChange={handleChange}
          required
        />
        <span onClick={() => setJelszoLathato(!jelszoLathato)} className="jelszo-toggle">
          {jelszoLathato ? "Elrejt" : "Mutat"}
        </span>
      </div>

      <div className="auth-password-toggle">
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
          {jelszoUjraLathato ? "Elrejt" : "Mutat"}
        </span>
      </div>

      <button type="submit">Regisztráció</button>
    </form>
    </div>
  );
};

export default Regisztracio;
