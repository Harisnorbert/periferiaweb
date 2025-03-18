import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Regisztracio.css";

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
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/felhasznalo/regisztracio", form);
      alert(response.data.message);
      navigate("/bejelentkezes");
    } catch (error) {
      alert(error.response?.data?.message || "Regisztráció sikertelen!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Regisztráció</h2>
      <input type="text" name="nev" placeholder="Név" onChange={handleChange} required />
      <input type="text" name="irsz" placeholder="Irányítószám" onChange={handleChange} required />
      <input type="text" name="varos" placeholder="Város" onChange={handleChange} required />
      <input type="text" name="utcaHazszam" placeholder="Utca, házszám" onChange={handleChange} required />
      <input type="text" name="telefon" placeholder="Telefonszám" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="jelszo" placeholder="Jelszó" onChange={handleChange} required />
      <button type="submit">Regisztráció</button>
    </form>
  );
};

export default Regisztracio;