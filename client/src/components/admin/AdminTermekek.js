import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTermekek = () => {
  const [termek, setTermek] = useState({
    nev: "",
    ar: "",
    category: "",
    imageUrl: "",
    leiras: "",
  });
  const [termekek, setTermekek] = useState([]);
  const [szerkesztett, setSzerkesztett] = useState(null);

  const handleChange = (e) => {
    setTermek({ ...termek, [e.target.name]: e.target.value });
  };

  const betoltTermekeket = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/termekek`);
      setTermekek(res.data);
    } catch (err) {
      console.error("Nem sikerült lekérni a termékeket:", err);
    }
  };

  useEffect(() => {
    betoltTermekeket();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const kuldoAdat = {
        name: termek.nev || "",
        price: Number(termek.ar) || 0,
        category: termek.category || "",
        imageUrl: termek.imageUrl || "",
        description: termek.leiras || "",
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/termekek`, kuldoAdat);
      alert("Termék sikeresen hozzáadva!");
      setTermek({ nev: "", ar: "", category: "", imageUrl: "", leiras: "" });
      betoltTermekeket();
    } catch (err) {
      console.error("Hiba:", err);
      alert("Nem sikerült a mentés.");
    }
  };

  const handleEditClick = (termek) => {
    setSzerkesztett({ ...termek });
  };

  const handleSzerkesztesValtozas = (e) => {
    setSzerkesztett({ ...szerkesztett, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const frissitett = {
        name: szerkesztett.name,
        price: Number(szerkesztett.price),
        category: szerkesztett.category,
        imageUrl: szerkesztett.imageUrl,
        description: szerkesztett.description,
      };
      await axios.put(`${process.env.REACT_APP_API_URL}/termekek/${szerkesztett._id}`, frissitett);
      alert("Termék frissítve");
      setSzerkesztett(null);
      betoltTermekeket();
    } catch (err) {
      console.error("Hiba frissítéskor:", err);
      alert("Nem sikerült frissíteni a terméket");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törlöd ezt a terméket?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/termekek/${id}`);
      alert("Termék törölve");
      betoltTermekeket();
    } catch (err) {
      console.error("Hiba törléskor:", err);
      alert("Nem sikerült törölni a terméket");
    }
  };

  return (
    <div className="admin-termek-container">
      <h3>Új termék hozzáadása</h3>
      <form onSubmit={handleSubmit} className="admin-termek-form">
        <input type="text" name="nev" value={termek.nev || ""} onChange={handleChange} placeholder="Termék neve" required />
        <input type="text" name="ar" value={termek.ar || ""} onChange={handleChange} placeholder="Ár (Ft)" required />
        <input type="text" name="category" value={termek.category || ""} onChange={handleChange} placeholder="Kategória" />
        <input type="text" name="imageUrl" value={termek.imageUrl || ""} onChange={handleChange} placeholder="Kép URL (opcionális)" />
        <textarea name="leiras" value={termek.leiras || ""} onChange={handleChange} placeholder="Termék leírása" rows={3} />
        <button type="submit">Mentés</button>
      </form>

      <h3>Feltöltött termékek</h3>
      <table className="admin-termek-tabla">
        <thead>
          <tr>
            <th>Név</th>
            <th>Ár</th>
            <th>Kategória</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {termekek.map((t) => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.price} Ft</td>
              <td>{t.category}</td>
              <td>
                <button onClick={() => handleEditClick(t)}>Módosítás</button>
                <button onClick={() => handleDelete(t._id)} style={{ marginLeft: '0.5rem', backgroundColor: '#ff4d4f' }}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {szerkesztett && (
        <div className="modal">
          <div className="modal-tartalom">
            <h4>Termék módosítása</h4>
            <input type="text" name="name" value={szerkesztett.name || ""} onChange={handleSzerkesztesValtozas} placeholder="Név" />
            <input type="number" name="price" value={szerkesztett.price || ""} onChange={handleSzerkesztesValtozas} placeholder="Ár" />
            <input type="text" name="category" value={szerkesztett.category || ""} onChange={handleSzerkesztesValtozas} placeholder="Kategória" />
            <input type="text" name="imageUrl" value={szerkesztett.imageUrl || ""} onChange={handleSzerkesztesValtozas} placeholder="Kép URL" />
            <textarea name="description" value={szerkesztett.description || ""} onChange={handleSzerkesztesValtozas} placeholder="Leírás" />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleUpdate}>Mentés</button>
              <button onClick={() => setSzerkesztett(null)}>Mégse</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTermekek;
