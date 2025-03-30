import React, { useEffect, useState } from "react";
import axios from "axios";
import "./gameresui.css";

const TermekLista = ({ hozzaadKosarhoz }) => {
  const [termekek, setTermekek] = useState([]);
  const [kivalasztottTermek, setKivalasztottTermek] = useState(null);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [darab, setDarab] = useState(1);

  useEffect(() => {
    axios.get("http://localhost:5000/termekek")
      .then((res) => {
        setTermekek(res.data);
        setBetolt(false);
      })
      .catch(() => {
        setHiba("Nem sikerült betölteni a termékeket.");
        setBetolt(false);
      });
  }, []);

  const reszletek = (termek) => {
    setKivalasztottTermek(termek);
    setDarab(1);
  };

  if (betolt) return <p>Termékek betöltése...</p>;
  if (hiba) return <p>{hiba}</p>;

  return (
    <section id="termekek-szakasz" className="termekek-container">
      <h2>Elérhető termékek</h2>
      <div className="termek-lista">
        {termekek.length === 0 ? (
          <p>Jelenleg nincsenek elérhető termékek.</p>
        ) : (
          termekek.map((termek) => (
            <div
              className="termek-kartya"
              key={termek._id}
              onClick={() => reszletek(termek)}
            >
              <h3>{termek.name}</h3>
              <p>Ár: {termek.price} Ft</p>
              <p>{termek.description}</p>
            </div>
          ))
        )}
      </div>

      {kivalasztottTermek && (
        <div className="modal">
          <div className="modal-tartalom">
            <span className="modalzaras" onClick={() => setKivalasztottTermek(null)}>
              &times;
            </span>
            <h2>{kivalasztottTermek.name}</h2>
            <p><strong>Ár:</strong> {kivalasztottTermek.price} Ft</p>
            <p><strong>Leírás:</strong> {kivalasztottTermek.description}</p>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button onClick={() => setDarab(Math.max(1, darab - 1))}>-</button>
              <span>{darab}</span>
              <button onClick={() => setDarab(darab + 1)}>+</button>
            </div>
            <button
              onClick={() => {
                hozzaadKosarhoz({ ...kivalasztottTermek, db: darab });
                document.body.classList.add("bedobas-effekt");
                setTimeout(() => {
                  document.body.classList.remove("bedobas-effekt");
                }, 300);
                setKivalasztottTermek(null);
              }}
              className="fizetes-gomb"
              style={{ marginTop: "1rem" }}
            >
              Kosárba teszem
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TermekLista;
