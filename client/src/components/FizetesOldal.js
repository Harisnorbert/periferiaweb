import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FizetesOldal.css";
import axios from "axios";

const FizetesOldal = ({ kosar, kosarUrites, setFelhasznalo }) => {
  const [felhasznalo, setFelhasznaloAdatok] = useState(null);
  const [nev, setNev] = useState("");
  const [irsz, setIrsz] = useState("");
  const [varos, setVaros] = useState("");
  const [utcaHazszam, setUtcaHazszam] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [fizetesiMod, setFizetesiMod] = useState("utanvet");
  const [kartyaSzam, setKartyaSzam] = useState("");
  const [lejaratiDatum, setLejaratiDatum] = useState("");
  const [cvc, setCvc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:5000/felhasznalo", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        if (res.data) {
          setFelhasznalo(res.data);
          setFelhasznaloAdatok(res.data);
          setNev(res.data.nev || "");
          setIrsz(res.data.irsz || "");
          setVaros(res.data.varos || "");
          setUtcaHazszam(res.data.utcaHazszam || "");
          setTelefon(res.data.telefon || "");
          setEmail(res.data.email || "");
        }
      })
      .catch((err) => console.error("Hiba a profil betöltésekor:", err));
    }
  }, [setFelhasznalo]);

  const osszAr = kosar.reduce((osszeg, termek) => osszeg + (Number(termek.ar) || 0), 0);

  const kezelRendelest = async (e) => {
    e.preventDefault();

    console.log(kosar);

    if (!kosar || kosar.length === 0) {
      alert("A kosár üres! Nem lehet rendelést leadni.");
      return;
    }

    if (fizetesiMod === "bankkártya") {
      if (!kartyaSzam || !lejaratiDatum || !cvc) {
        alert("Kérlek, töltsd ki a bankkártya adatokat!");
        return;
      }
      if (kartyaSzam.length !== 16 || isNaN(kartyaSzam)) {
        alert("A kártyaszámnak 16 számjegyből kell állnia!");
        return;
      }
      if (cvc.length !== 3 || isNaN(cvc)) {
        alert("A CVC-nek 3 számjegyből kell állnia!");
        return;
      }
    }

    try {
      const rendelesAdatok = {
        felhasznalo: felhasznalo ? felhasznalo._id : null,
        vendegAdatok: felhasznalo ? null : { nev, irsz, varos, utcaHazszam, telefon, email },
        fizetesiMod,
        osszAr,
        kosar: kosar.map((termek) => ({
          nev: termek.name,
          ar: termek.price,
          leiras: termek.description || ""
        }))
      };

      console.log(rendelesAdatok);

      const response = await axios.post("http://localhost:5000/rendeles", rendelesAdatok);
      console.log("Sikeres rendelés:", response.data);
      alert(`Rendelés sikeresen leadva! Összesen: ${osszAr} Ft`);
      kosarUrites();
      navigate("/rendeles-sikeres");
    } catch (error) {
      console.error("Hiba a rendelés leadásakor:", error);
      alert("Hiba történt a rendelés leadásakor.");
    }
  };

  return (
    <div className="fizetes-oldal">
      <h2>Fizetés</h2>
      <form onSubmit={kezelRendelest}>

        {!felhasznalo && (
          <>
            <label>
              Teljes név:
              <input type="text" value={nev} onChange={(e) => setNev(e.target.value)} required />
            </label>
            <label>
              Irányítószám:
              <input type="text" value={irsz} onChange={(e) => setIrsz(e.target.value)} required />
            </label>
            <label>
              Város:
              <input type="text" value={varos} onChange={(e) => setVaros(e.target.value)} required />
            </label>
            <label>
              Utca és házszám:
              <input type="text" placeholder="Minta utca 1." value={utcaHazszam} onChange={(e) => setUtcaHazszam(e.target.value)} required />
            </label>
            <label>
              Telefonszám (+36):
              <input type="tel" placeholder="+36701234567" value={telefon} onChange={(e) => setTelefon(e.target.value)} required />
            </label>
            <label>
              Email cím:
              <input type="email" placeholder="minta@minta.hu" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
          </>
        )}

        <label>
          Fizetési mód:
          <select value={fizetesiMod} onChange={(e) => setFizetesiMod(e.target.value)}>
            <option value="utanvet">Utánvét</option>
            <option value="bankkártya">Bankkártya</option> 
          </select>
        </label>

        {fizetesiMod === "bankkártya" && (
          <div className="kartya-adatok">
            <h3>Bankkártya adatok</h3>
            <label>
              Kártyaszám:
              <input
                type="text"
                maxLength="16"
                placeholder="1234 5678 9012 3456"
                value={kartyaSzam}
                onChange={(e) => setKartyaSzam(e.target.value)}
                required
              />
            </label>
            <label>
              Lejárati dátum (HH/ÉÉ):
              <input
                type="text"
                placeholder="MM/YY"
                maxLength="5"
                value={lejaratiDatum}
                onChange={(e) => setLejaratiDatum(e.target.value)}
                required
              />
            </label>
            <label>
              CVC:
              <input
                type="text"
                maxLength="3"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
              />
            </label>
          </div>
        )}

        <p><strong>Összesen:</strong> {osszAr} Ft</p>
        <button type="submit">Rendelés leadása</button>
      </form>
    </div>
  );
};

export default FizetesOldal;
