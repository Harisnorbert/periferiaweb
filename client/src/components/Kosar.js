import React from "react";
import "./Kosar.css";
import { useNavigate } from "react-router-dom";

const Kosar = ({ kosar, torlesKosarbol }) => {
  const osszAr = kosar.reduce((osszeg, termek) => osszeg + Number(termek.price || 0), 0);
  const navigate=useNavigate();

  return (
    <div className="kosar">
      <h2>Kosár</h2>
      {kosar.length === 0 ? (
        <p>A kosár üres.</p>
      ) : (
        <ul>
          {kosar.map((termek, index) => (
            <li key={index}>
              {termek.name} - {termek.price} Ft
              <button onClick={() => torlesKosarbol(index)}>Törlés</button>
            </li>
          ))}
        </ul>
      )}
      <p><strong>Összesen:</strong> {osszAr} Ft</p>
      {kosar.length > 0 && (
        <button className="fizetes-gomb" onClick={()=> navigate("/FizetesOldal")}>
          Fizetés
        </button>)}
    </div>
  );
};

export default Kosar;
