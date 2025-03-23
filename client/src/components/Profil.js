import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import "./Profil.css";

const Profil = ({ felhasznalo, setFelhasznalo }) => {
  const [rendelesek, setRendelesek] = useState([]);
  const [form, setForm] = useState(null);
  const [uzenet, setUzenet] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!felhasznalo) {
      navigate("/bejelentkezes");
      return;
    }

    setForm({ ...felhasznalo, jelszo: "" }); // jelszó külön mező, nem jön a backendből

    axios.get(`http://localhost:5000/rendeles/felhasznalo/${felhasznalo._id}`)
      .then(res => setRendelesek(res.data))
      .catch(err => console.error("Hiba a rendelések lekérésekor:", err));
  }, [felhasznalo, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/felhasznalo", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFelhasznalo(response.data.felhasznalo);
      localStorage.setItem("felhasznalo", JSON.stringify(response.data.felhasznalo));
      setUzenet("✅ Sikeresen frissítve!");
    } catch (error) {
      console.error(error);
      setUzenet(error.response?.data?.message || "❌ Hiba történt a frissítéskor!");
    }
  };

  if (!form) return <p>Adatok betöltése...</p>;

  return (
    <div className="profil-container">
      <h2>Profil szerkesztése</h2>

      <div className="profil-adatok">
        <input name="nev" value={form.nev} onChange={handleChange} placeholder="Név" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="telefon" value={form.telefon} onChange={handleChange} placeholder="Telefonszám" />
        <input name="irsz" value={form.irsz} onChange={handleChange} placeholder="Irányítószám" />
        <input name="varos" value={form.varos} onChange={handleChange} placeholder="Város" />
        <input name="utcaHazszam" value={form.utcaHazszam} onChange={handleChange} placeholder="Utca, házszám" />
        <input name="jelszo" type="password" value={form.jelszo} onChange={handleChange} placeholder="Új jelszó (opcionális)" />
        <button onClick={handleSave}>Mentés</button>
        {uzenet && <p>{uzenet}</p>}
      </div>

      <h3>Korábbi rendeléseid</h3>
      {rendelesek.length === 0 ? (
        <p>Még nincs rendelésed.</p>
      ) : (
        rendelesek.map((rendeles, index) => (
          <div key={index} className="rendeles">
            <p><strong>Dátum:</strong> {new Date(rendeles.datum).toLocaleDateString()}</p>
            <p><strong>Összeg:</strong> {rendeles.osszAr} Ft</p>
            <p><strong>Fizetési mód:</strong> {rendeles.fizetesiMod}</p>
            <ul className="termekek-lista">
              {rendeles.kosar.map((termek, i) => (
                <li key={i}>{termek.nev} - {termek.ar} Ft × {termek.db || 1}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Profil;
