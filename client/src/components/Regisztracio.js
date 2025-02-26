import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Regisztracio.css";

const Regisztracio = () => {
  const [form, setForm] = useState({ nev: "", irsz: "", varos: "", utcaHazszam: "", telefon: "", email: "", jelszo: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/felhasznalo/regisztracio",form, {headers:{ "Content-Type": "application/json" }});
      alert("Sikeres regisztráció!");
      console.log("Szerver válasza:", response.data);
      navigate("/bejelentkezes");
    } catch (error) {
      console.error("Hiba a regisztráció közben:", error.response?.data || error.message);
      alert("Regisztráció sikertelen!");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Regisztráció</h2>
      <input type="text" name="nev" placeholder="Teljes név" value={form.nev} onChange={handleChange} required />
      <input type="text" name="irsz" placeholder="Irányítószám" value={form.irsz} onChange={handleChange} required />
      <input type="text" name="varos" placeholder="Város" value={form.varos} onChange={handleChange} required />
      <input type="text" name="utcaHazszam" placeholder="Utca és házszám" value={form.utcaHazszam} onChange={handleChange} required />
      <input type="text" name="telefon" placeholder="Telefonszám" value={form.telefon} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email cím" value={form.email} onChange={handleChange} required />
      <input type="password" name="jelszo" placeholder="Jelszó" value={form.jelszo} onChange={handleChange} required />
      <button type="submit">Regisztráció</button>
    </form>
  );
};

export default Regisztracio;
