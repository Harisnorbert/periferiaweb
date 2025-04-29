import React from "react";
import { useNavigate } from "react-router-dom";

const Kosar = ({ kosar, frissitDarab, torlesKosarbol }) => {
  const navigate = useNavigate();
  const osszeg = kosar.reduce((sum, t) => sum + (Number(t.price || 0) * (t.db || 1)), 0);

  return (
    <div className="kosar-panel">
      <h3>Kosár</h3>
      {kosar.length === 0 ? (
        <p>A kosár üres.</p>
      ) : (
        <ul>
          {kosar.map((termek, index) => (
            <li key={index} className="kosar-item">
              <div className="kosar-item-felso">
                <strong>{termek.name } </strong>
                <p className="kosar-ar"> { termek.price * termek.db} Ft</p>
              </div>
              <div className="kosar-muveletek">
                <button onClick={() => frissitDarab(index, -1)}>-</button>
                <span>{termek.db || 1}</span>
                <button onClick={() => frissitDarab(index, 1)}>+</button>
              </div>
              <button className="torles-gomb" onClick={() => torlesKosarbol(index)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}
      <div className="kosar-osszeg">
        <p><strong>Összesen:</strong> {osszeg} Ft</p>
        {kosar.length > 0 && (
          <button className="fizetes-gomb" onClick={() => navigate("/FizetesOldal")}>Fizetés</button>
        )}
      </div>
    </div>
  );
};

export default Kosar;