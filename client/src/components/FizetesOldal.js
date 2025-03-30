import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    const tarolt = localStorage.getItem("kosar");
    const taroltKosar = tarolt ? JSON.parse(tarolt) : [];
    setKosar(taroltKosar);
  }, [setKosar]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/felhasznalo`, {
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
  const formatKartyaSzam = (value) => {
    return value
      .replace(/\D/g, "") 
      .slice(0,16)
      .replace(/(.{4})/g, "$1 ")
      .trim(); 
  };

  const formatTelefon = (value) => {
    return value
      .replace(/\D/g, "")                              // csak számok
      .replace(/^36/, "+36 ")                          // magyar hívószám
      .replace(/^(\+36)(\d{1,2})/, "$1 $2")            // előtag + körzetszám
      .replace(/^(\+36 \d{1,2})(\d{3})/, "$1 $2")      // 3 szám
      .replace(/^(\+36 \d{1,2} \d{3})(\d{0,4})/, "$1 $2") // maradék
      .trim();
  };

  const formatLejaratiDatum = (value) => {
    return value
      .replace(/\D/g, "")                 // csak szám
      .slice(0, 4)                        // max 4 számjegy
      .replace(/^(\d{2})(\d{0,2})/, "$1/$2");
  };
  const tisztitottKartya = kartyaSzam.replace(/\s/g, "");

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
      if (tisztitottKartya.length !== 16 || isNaN(tisztitottKartya)) {
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
          kartyaSzam: tisztitottKartya,
          lejaratiDatum,
          cvc
        } : null,
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/rendeles`, rendelesAdatok);
      alert(`Rendelés sikeres! Összeg: ${osszAr} Ft`);
      kosarUrites();
      navigate("/");
    } catch (error) {
      console.error("Hiba rendeléskor:", error.response?.data || error.message);
      alert("Hiba történt a rendelés során!");
    }
  };

  return (
    <div className="fizetes-container">
      <h2>Fizetés</h2>

      <div className="fizetes-rendeles">
        {kosar.map((t, i) => (
          <p key={i}>
            {t.nev || t.name} × {t.db || 1} – {(t.ar || t.price) * (t.db || 1)} Ft
          </p>
        ))}
      </div>

      <form onSubmit={kezelRendelest} className="fizetes-form">
        <input type="text" placeholder="Teljes név" value={nev} onChange={(e) => setNev(e.target.value)} required />
        <input type="text" placeholder="Irányítószám" value={irsz} onChange={(e) => setIrsz(e.target.value)} required />
        <input type="text" placeholder="Város" value={varos} onChange={(e) => setVaros(e.target.value)} required />
        <input type="text" placeholder="Utca, házszám" value={utcaHazszam} onChange={(e) => setUtcaHazszam(e.target.value)} required />
        <input type="tel" placeholder="Telefonszám" value={telefon} onChange={(e) => setTelefon(formatTelefon(e.target.value))} required/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <select value={fizetesiMod} onChange={(e) => setFizetesiMod(e.target.value)} required>
          <option value="utanvet">Utánvét</option>
          <option value="bankkártya">Bankkártya</option>
        </select>

        {fizetesiMod === "bankkártya" && (
          <>
            <input type="text" placeholder="Kártyaszám" value={kartyaSzam} maxLength={19} onChange={(e) => setKartyaSzam(formatKartyaSzam(e.target.value))} required/>
            <input type="text" placeholder="Lejárati dátum (MM/YY)" value={lejaratiDatum} onChange={(e) => setLejaratiDatum(formatLejaratiDatum(e.target.value))} maxLength={5} required/>
            <input type="text" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} required />
          </>
        )}
      </form>

      <div className="fizetes-osszeg">Összesen: {osszAr} Ft</div>

      <button className="fizetes-gomb" onClick={kezelRendelest}>Rendelés leadása</button>
    </div>
  );
};

export default FizetesOldal;
