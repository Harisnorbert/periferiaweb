import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminRendelesek = () => {
  const [rendelesek, setRendelesek] = useState([]);
  const [szures, setSzures] = useState("");
  const [kereses, setKereses] = useState("");

  const betoltRendelesek = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/rendeles`);
      setRendelesek(res.data);
    } catch (err) {
      console.error("Hiba a rendelések lekérdezésekor:", err);
    }
  };

  useEffect(() => {
    betoltRendelesek();
  }, []);

  const handleStatuszValtozas = async (id, ujStatusz) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/rendeles/${id}`, { statusz: ujStatusz });
      betoltRendelesek();
    } catch (err) {
      console.error("Hiba a státusz frissítésénél:", err);
    }
  };

  const szurtRendelesek = rendelesek
    .filter(r => szures ? r.statusz === szures : true)
    .filter(r => {
      const kulcsok = [r.nev, r.email];
      return kulcsok.some(k => k?.toLowerCase().includes(kereses.toLowerCase()));
    })
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));

  return (
    <div className="admin-rendelesek">
      <h3>Beérkezett rendelések</h3>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select onChange={e => setSzures(e.target.value)} value={szures}>
          <option value="">Összes státusz</option>
          <option value="Függőben">Függőben</option>
          <option value="Feldolgozás alatt">Feldolgozás alatt</option>
          <option value="Teljesítve">Teljesítve</option>
        </select>

        <input
          type="text"
          placeholder="Keresés név vagy email alapján"
          value={kereses}
          onChange={(e) => setKereses(e.target.value)}
        />
      </div>

      <table className="admin-rendelesek-tabla">
        <thead>
          <tr>
            <th>Név</th>
            <th>Email</th>
            <th>Dátum</th>
            <th>Fizetés</th>
            <th>Összeg</th>
            <th>Státusz</th>
            <th>Termékek</th>
          </tr>
        </thead>
        <tbody>
          {szurtRendelesek.map(r => (
            <tr key={r._id}>
              <td>{r.nev}</td>
              <td>{r.email}</td>
              <td>{new Date(r.datum).toLocaleString()}</td>
              <td>{r.fizetesiMod === "utanvet" ? "Utánvét" : "Bankkártya"}</td>
              <td>{r.osszAr} Ft</td>
              <td>
                <select value={r.statusz} onChange={(e) => handleStatuszValtozas(r._id, e.target.value)}>
                  <option value="Függőben">Függőben</option>
                  <option value="Feldolgozás alatt">Feldolgozás alatt</option>
                  <option value="Teljesítve">Teljesítve</option>
                </select>
              </td>
              <td>
                <ul>
                  {r.kosar.map((t, i) => (
                    <li key={i}>{t.nev} × {t.db} – {t.ar} Ft</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRendelesek;
