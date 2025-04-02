import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    setForm({ ...felhasznalo, jelszo: "" });
    console.log("Bejelentkezett felhasználó:", felhasznalo);


    axios.get(`${process.env.REACT_APP_API_URL}/felhasznalo/${felhasznalo._id}`)
      .then(res => setRendelesek(res.data))
      .catch(err => console.error("Hiba a rendelések lekérésekor:", err));
  }, [felhasznalo, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/felhasznalo`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFelhasznalo(response.data.felhasznalo);
      localStorage.setItem("felhasznalo", JSON.stringify(response.data.felhasznalo));
      setUzenet("Sikeresen frissítve!");
    } catch (error) {
      console.error(error);
      setUzenet(error.response?.data?.message || "Hiba történt a frissítéskor!");
    }
  };

  if (!form) return <p>Adatok betöltése...</p>;

  return (
    <div className="profil-container">
      <h2>Profil szerkesztése</h2>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="profil-form">
        <input name="nev" value={form.nev} onChange={handleChange} placeholder="Név" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="telefon" value={form.telefon} onChange={handleChange} placeholder="Telefonszám" required />
        <input name="irsz" value={form.irsz} onChange={handleChange} placeholder="Irányítószám" required />
        <input name="varos" value={form.varos} onChange={handleChange} placeholder="Város" required />
        <input name="utcaHazszam" value={form.utcaHazszam} onChange={handleChange} placeholder="Utca, házszám" required />
        <input name="jelszo" type="password" value={form.jelszo} onChange={handleChange} placeholder="Új jelszó (opcionális)" />
        <button type="submit" className="mentes-gomb">Mentés</button>
        {uzenet && <p>{uzenet}</p>}
      </form>

      <h3>Korábbi rendeléseid</h3>

      <div className="rendeles-lista">
        {rendelesek.length === 0 ? (
          <p>Még nincs rendelésed.</p>
        ) : (
          rendelesek.map((rendeles, index) => (
            <div key={index} className="rendeles-doboz">
              <p><strong>Dátum:</strong> {new Date(rendeles.datum).toLocaleDateString()}</p>
              <p><strong>Összeg:</strong> {rendeles.osszAr} Ft</p>
              <p><strong>Fizetési mód:</strong> {rendeles.fizetesiMod === "utanvet" ? "Utánvét" : "Bankkártya"}</p>
              <ul>
                {rendeles.kosar.map((termek, i) => (
                  <li key={i}>
                    {termek.nev} – {termek.ar} Ft × {termek.db || 1}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profil;
