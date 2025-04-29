import React, { useEffect, useState } from "react";
import axios from "axios";
import "./gameresui.css";

const TermekLista = ({ hozzaadKosarhoz }) => {
  const [termekek, setTermekek] = useState([]);
  const [kivalasztottTermek, setKivalasztottTermek] = useState(null);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const [darab, setDarab] = useState(1);

  const [kategoriaSzuro, setKategoriaSzuro] = useState([]);
  const [kategoriaLista, setKategoriaLista] = useState([]);
  const [szuroLathato, setSzuroLathato] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/termekek`)
      .then((res) => {
        setTermekek(res.data);
        const kategoriak = [...new Set(res.data.map(t => t.category).filter(Boolean))];
        setKategoriaLista(kategoriak);
        setBetolt(false);
      })
      .catch(() => {
        setHiba("Nem sikerült betölteni a termékeket.");
        setBetolt(false);
      });
  }, []);

  const szurtTermekek = kategoriaSzuro.length > 0
    ? termekek.filter(t => kategoriaSzuro.includes(t.category))
    : termekek;

  const kezeliKategoriaValtozas = (kategoria) => {
    setKategoriaSzuro(prev =>
      prev.includes(kategoria)
        ? prev.filter(k => k !== kategoria)
        : [...prev, kategoria]
    );
  };

  const reszletek = (termek) => {
    setKivalasztottTermek(termek);
    setDarab(1);
  };

  if (betolt) return <p>Termékek betöltése...</p>;
  if (hiba) return <p>{hiba}</p>;

  return (
    <section id="termekek-szakasz" className="termekek-container">
      <h2>Elérhető termékek</h2>

      <div className="kategoria-szuro">
        <button onClick={() => setSzuroLathato(!szuroLathato)}>
          Kategória szűrő
        </button>
        {szuroLathato && (
          <div className="kategoria-legordulo">
            {kategoriaLista.map((kategoria, i) => (
              <label key={i} style={{ display: "block", marginBottom: "0.25rem" }}>
                <input
                  type="checkbox"
                  checked={kategoriaSzuro.includes(kategoria)}
                  onChange={() => kezeliKategoriaValtozas(kategoria)}
                />
                {kategoria}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="termek-lista">
        {szurtTermekek.length === 0 ? (
          <p>Nincs találat a kiválasztott kategóriákra.</p>
        ) : (
          szurtTermekek.map((termek) => (
            <div
              className="termek-kartya"
              key={termek._id}
              onClick={() => reszletek(termek)}
            >
              <h3>{termek.name}</h3>
              {termek.imageUrl && (
              <img
                src={termek.imageUrl}
                alt={termek.name}
                className="termek-kartya-kep"
              />
              )}
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
            { kivalasztottTermek.imageUrl && (
              <img
                src={kivalasztottTermek.imageUrl}
                alt={kivalasztottTermek.name}
                className="modal-kep"
              />
            )}
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
