import React from "react";
import { useNavigate } from "react-router-dom";

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
          {kosar.map((termek, index) => (
            <div key={index} className="kosar-tetel">
              <h4>{termek.nev || termek.name}</h4>

              <div className="kosar-muveletek">
                <button onClick={() => frissitDarab(index, -1)}>-</button>
                <span>{termek.db || 1}</span>
                <button onClick={() => frissitDarab(index, 1)}>+</button>
              </div>

              <p>{(Number(termek.ar) || Number(termek.price)) * (termek.db || 1)} Ft</p>

              <button className="torles-gomb" onClick={() => torlesKosarbol(index)}>🗑️</button>
            </div>
          ))}

          <div className="kosar-vegosszeg">
            Összesen: {osszAr} Ft
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
