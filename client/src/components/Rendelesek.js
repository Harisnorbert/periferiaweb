import React, { useEffect, useState } from "react";
import axios from "axios";

const Rendelesek = ({ felhasznalo }) => {
  const [rendelesek, setRendelesek] = useState([]);

  useEffect(() => {
    if (felhasznalo) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/rendeles/felhasznalo/${felhasznalo._id}`)
        .then((res) => setRendelesek(res.data))
        .catch((err) =>
          console.error("Hiba a rendelések lekérésekor:", err)
        );
    }
  }, [felhasznalo]);

  return (
    <div className="page-wrapper">
      <div className="rendelesek-container">
        <h2>Korábbi rendeléseim</h2>
        {rendelesek.length === 0 ? (
          <p>Még nincs rendelésed.</p>
        ) : (
          <div className="rendelesek-wrapper">
            {rendelesek.map((rendeles, index) => (
              <div key={index} className="rendeles">
                <p>
                  <strong>Dátum:</strong>{" "}
                  {new Date(rendeles.datum).toLocaleDateString()}
                </p>
                <p>
                  <strong>Összeg:</strong> {rendeles.osszAr} Ft
                </p>
                <p>
                  <strong>Fizetési mód:</strong> {rendeles.fizetesiMod}
                </p>
                <p>
                  <strong>Státusz:</strong> {rendeles.statusz}
                </p>
                <p>
                  <strong>Termékek:</strong>
                </p>
                <ul className="termekek-lista">
                  {rendeles.kosar.map((termek, i) => (
                    <li key={i}>
                      {termek.nev} - {termek.ar} Ft × {termek.db || 1}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rendelesek;
