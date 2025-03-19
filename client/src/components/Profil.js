import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profil.css";

const Profil = ({ felhasznalo }) => {
  const [rendelesek, setRendelesek] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!felhasznalo) {
      navigate("/bejelentkezes"); // Ha nincs bejelentkezve, átdobjuk a bejelentkezésre
      return;
    }

    // Rendelések lekérése
    axios.get(`http://localhost:5000/rendeles/felhasznalo/${felhasznalo._id}`)
      .then(res => setRendelesek(res.data))
      .catch(err => console.error("Hiba a rendelések lekérésekor:", err));
  }, [felhasznalo, navigate]);

  return (
    <div className="profil-container">
      <h2>Felhasználói profil</h2>

      {felhasznalo ? (
        <div className="profil-adatok">
          <p><strong>Név:</strong> {felhasznalo.nev}</p>
          <p><strong>Email:</strong> {felhasznalo.email}</p>
          <p><strong>Telefonszám:</strong> {felhasznalo.telefon}</p>
          <p><strong>Cím:</strong> {felhasznalo.irsz}, {felhasznalo.varos}, {felhasznalo.utcaHazszam}</p>
        </div>
      ) : (
        <p>Felhasználói adatok betöltése...</p>
      )}

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
                <li key={i}>{termek.nev} - {termek.ar} Ft</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Profil;
