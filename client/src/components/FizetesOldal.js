import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FizetesOldal.css";

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

  // **Kosár betöltése localStorage-ból**
  useEffect(() => {
    const taroltKosar = JSON.parse(localStorage.getItem("kosar")) || [];
    if (taroltKosar.length > 0) {
      console.log("Kosár betöltve a localStorage-ből:", taroltKosar);
      setKosar([...taroltKosar]);
    }
  }, [setKosar]);

  // **Felhasználói adatok betöltése az adatbázisból**
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:5000/felhasznalo", {
        headers: { Authorization: `Bearer ${token}` }
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
      .catch((err) => console.error("Hiba a profil betöltésekor:", err));
    }
  }, []);

  const osszAr = kosar.reduce((osszeg, termek) => osszeg + (Number(termek.ar) || Number(termek.price) || 0), 0);

  const kezelRendelest = async (e) => {
    e.preventDefault();
  
    // Kosár betöltése localStorage-ból, ha esetleg az állapotban üres lenne
    const aktualisKosar = JSON.parse(localStorage.getItem("kosar")) || [];
  
    if (!aktualisKosar || aktualisKosar.length === 0) {
      alert("A kosár üres! Nem lehet rendelést leadni.");
      return;
    }
  
    console.log("Rendelés előtt a kosár tartalma:", aktualisKosar);
  
    const osszAr = aktualisKosar.reduce((osszeg, termek) => osszeg + (Number(termek.ar) || Number(termek.price) || 0), 0);
  
    try {
      const rendelesAdatok = {
        felhasznaloId: felhasznalo ? felhasznalo._id : null,
        // **Most mindig elküldjük a felhasználói adatokat is, nem csak a felhasznaloId-t!**
        nev,
        irsz,
        varos,
        utcaHazszam,
        telefon,
        email,
        fizetesiMod,
        osszAr,
        kosar: aktualisKosar.map((termek) => ({
          nev: termek.nev || termek.name,
          ar: Number(termek.ar) || Number(termek.price),
          leiras: termek.leiras || termek.description || "",
        })),
        kartyaAdatok: fizetesiMod === "bankkártya" ? { kartyaSzam, lejaratiDatum, cvc } : null
      };
  
      console.log("Rendelés adatok küldése a szerverre:", rendelesAdatok);
  
      const response = await axios.post("http://localhost:5000/rendeles", rendelesAdatok);
      console.log("Sikeres rendelés:", response.data);
      alert(`Rendelés sikeresen leadva! Összesen: ${osszAr} Ft`);
  
      kosarUrites();
      navigate("/");
    } catch (error) {
      console.error("Hiba a rendelés mentésekor:", error.response ? error.response.data : error.message);
      alert("Hiba történt a rendelés leadásakor.");
    }
  };

  return (
    <div className="fizetes-oldal">
      <h2>Fizetés</h2>

      <h3>Rendelés tartalma:</h3>
      <ul>
        {kosar.map((termek, index) => (
          <li key={index}>
            {termek.nev || termek.name} - {Number(termek.ar) || Number(termek.price)} Ft
          </li>
        ))}
      </ul>

      <h3>Szállítási adatok</h3>
      <form onSubmit={kezelRendelest}>
        <label>Teljes név:<input type="text" value={nev} onChange={(e) => setNev(e.target.value)} required /></label>
        <label>Irányítószám:<input type="text" value={irsz} onChange={(e) => setIrsz(e.target.value)} required /></label>
        <label>Város:<input type="text" value={varos} onChange={(e) => setVaros(e.target.value)} required /></label>
        <label>Utca és házszám:<input type="text" value={utcaHazszam} onChange={(e) => setUtcaHazszam(e.target.value)} required /></label>
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
            <label>Kártyaszám:<input type="text" maxLength="16" value={kartyaSzam} onChange={(e) => setKartyaSzam(e.target.value)} required /></label>
            <label>Lejárati dátum (MM/YY):<input type="text" maxLength="5" value={lejaratiDatum} onChange={(e) => setLejaratiDatum(e.target.value)} required /></label>
            <label>CVC:<input type="text" maxLength="3" value={cvc} onChange={(e) => setCvc(e.target.value)} required /></label>
          </>
        )}

        <p><strong>Összesen:</strong> {osszAr} Ft</p>
        <button type="submit">Rendelés leadása</button>
      </form>
    </div>
  );
};

export default FizetesOldal;
