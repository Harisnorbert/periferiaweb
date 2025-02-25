import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Bejelentkezes.css";

const Bejelentkezes = ({ setFelhasznalo }) => {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`Küldött email: ${email}, jelszó: ${jelszo}`);

      const { data } = await axios.post(
        "http://localhost:5000/felhasznalo/bejelentkezes",
        { email, jelszo },{
          //withCredentials: true, ez kellene session alapú hitelesítéshez, ami XSS ellen véd, de valami nagyon nem működik, ha ez true :-(
          //Szerencsére REACT eleve szűr XSS-re :-)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem('token', data.token);
      setFelhasznalo(data.felhasznalo);

      localStorage.setItem("token", data.token);
      setFelhasznalo(data.felhasznalo);
      alert("Sikeres bejelentkezés!");
      navigate("/");
    } catch (error) {
      console.error("Bejelentkezési hiba:", error.response?.data || error.message);
      alert(`Hiba: ${error.response?.data?.message || "Ismeretlen hiba"}`);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Bejelentkezés</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
        required
      />
      <input
        type="password"
        placeholder="Jelszó"
        value={jelszo}
        onChange={(e) => setJelszo(e.target.value.trim())}
        required
      />
      <button type="submit">Bejelentkezés</button>
    </form>
  );
};

export default Bejelentkezes;
