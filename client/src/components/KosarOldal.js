import React from "react";
import { useNavigate } from "react-router-dom";
//import "./KosarOldal.css";

const KosarOldal = ({ kosar, frissitDarab, torlesKosarbol }) => {
  const navigate = useNavigate();

  const osszAr = kosar.reduce(
    (sum, termek) => sum + (Number(termek.price || termek.ar || 0) * (termek.db || 1)),
    0
  );

  return (
    <div className="kosar-oldal">
      <h2>Kosár tartalma</h2>

      {kosar.length === 0 ? (
        <p>A kosár üres.</p>
      ) : (
        <>
          <ul className="kosar-lista">
            {kosar.map((termek, index) => (
              <li key={index} className="kosar-item">
                <div className="kosar-termek-nev">{termek.nev || termek.name}</div>
                <div className="kosar-muveletek">
                  <button onClick={() => frissitDarab(index, -1)}>-</button>
                  <span>{termek.db || 1}</span>
                  <button onClick={() => frissitDarab(index, 1)}>+</button>
                </div>
                <div className="kosar-ar">
                  {(Number(termek.ar) || Number(termek.price)) * (termek.db || 1)} Ft
                </div>
                <button className="torles" onClick={() => torlesKosarbol(index)}>🗑️</button>
              </li>
            ))}
          </ul>

          <div className="kosar-osszeg">
            <strong>Összesen:</strong> {osszAr} Ft
          </div>

          <button className="fizetes-gomb" onClick={() => navigate("/FizetesOldal")}>
            Tovább a fizetéshez
          </button>
        </>
      )}
    </div>
  );
};

export default KosarOldal;
