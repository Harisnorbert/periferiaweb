import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import "./FizetesOldal.css";

const FizetesOldal = ({ kosar, setKosar, kosarUrites }) => {
  const [felhasznalo, setFelhasznalo] = useState(null);
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

  // Kosár betöltése
  useEffect(() => {
    const taroltKosar = JSON.parse(localStorage.getItem("kosar")) || [];
    setKosar(taroltKosar);
  }, [setKosar]);

  // Felhasználói adatok betöltése
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:5000/felhasznalo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.felhasznalo) {
          const user = res.data.felhasznalo;
          setFelhasznalo(user);
          setNev(user.nev || "");
          setIrsz(user.irsz || "");
          setVaros(user.varos || "");
          setUtcaHazszam(user.utcaHazszam || "");
          setTelefon(user.telefon || "");
          setEmail(user.email || "");
        }
      })
      .catch((err) => console.error("Hiba a felhasználó betöltésekor:", err));
    }
  }, []);

  const osszAr = kosar.reduce(
    (osszeg, termek) => osszeg + (Number(termek.ar) || Number(termek.price)) * (termek.db || 1),
    0
  );

  const kezelRendelest = async (e) => {
    e.preventDefault();

    if (kosar.length === 0) {
      alert("A kosár üres!");
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
      if (!/^\d{2}\/\d{2}$/.test(lejaratiDatum)) {
        alert("A lejárati dátumnak MM/YY formátumúnak kell lennie!");
        return;
      }
      if (cvc.length !== 3 || isNaN(cvc)) {
        alert("A CVC-nek 3 számjegyből kell állnia!");
        return;
      }
    }

    try {
      const rendelesAdatok = {
        felhasznaloId: felhasznalo ? felhasznalo._id : null,
        nev,
        irsz,
        varos,
        utcaHazszam,
        telefon,
        email,
        fizetesiMod,
        osszAr,
        kosar: kosar.map((termek) => ({
          nev: termek.nev || termek.name,
          ar: Number(termek.ar) || Number(termek.price),
          leiras: termek.leiras || termek.description || "",
          db: termek.db || 1
        })),
        kartyaAdatok: fizetesiMod === "bankkártya" ? {
          kartyaSzam,
          lejaratiDatum,
          cvc
        } : null,
      };

      console.log("Rendelés elküldve:", rendelesAdatok);

      await axios.post("http://localhost:5000/rendeles", rendelesAdatok);
      alert(`Rendelés sikeres! Összeg: ${osszAr} Ft`);
      kosarUrites();
      navigate("/");
    } catch (error) {
      console.error("Hiba rendeléskor:", error.response?.data || error.message);
      alert("Hiba történt a rendelés során!");
    }
  };

  return (
    <div className="form-container">
      <h2>Fizetés</h2>

      <h3>Rendelés tartalma:</h3>
      <ul>
        {kosar.map((termek, index) => (
          <li key={index}>
            {termek.nev || termek.name} × {termek.db || 1} –{" "}
            {(Number(termek.ar) || Number(termek.price)) * (termek.db || 1)} Ft
          </li>
        ))}
      </ul>
        <div className="fizetes-oldal">
      <form onSubmit={kezelRendelest}>
        <h3>Szállítási adatok</h3>
        <label>Teljes név:<input type="text" value={nev} onChange={(e) => setNev(e.target.value)} required /></label>
        <label>Irányítószám:<input type="text" value={irsz} onChange={(e) => setIrsz(e.target.value)} required /></label>
        <label>Város:<input type="text" value={varos} onChange={(e) => setVaros(e.target.value)} required /></label>
        <label>Utca, házszám:<input type="text" value={utcaHazszam} onChange={(e) => setUtcaHazszam(e.target.value)} required /></label>
        <label>Telefonszám:<input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} required /></label>
        <label>Email:<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>

        <label>Fizetési mód:
          <select value={fizetesiMod} onChange={(e) => setFizetesiMod(e.target.value)}>
            <option value="utanvet">Utánvét</option>
            <option value="bankkártya">Bankkártya</option>
          </select>
        </label>

        {fizetesiMod === "bankkártya" && (
          <>
            <label>Kártyaszám:<input type="text" value={kartyaSzam} onChange={(e) => setKartyaSzam(e.target.value)} required /></label>
            <label>Lejárati dátum:<input type="text" value={lejaratiDatum} onChange={(e) => setLejaratiDatum(e.target.value)} required /></label>
            <label>CVC:<input type="text" value={cvc} onChange={(e) => setCvc(e.target.value)} required /></label>
          </>
        )}

        <p><strong>Összesen:</strong> {osszAr} Ft</p>
        <button type="submit">Rendelés leadása</button>
      </form>
      </div>
    </div>
  );
};

export default FizetesOldal;
