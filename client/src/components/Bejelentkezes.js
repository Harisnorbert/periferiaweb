import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Bejelentkezes = ({ setFelhasznalo, setKosar }) => {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/felhasznalo/bejelentkezes", { email, jelszo });
      
      console.log("Bejelentkezés sikeres:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("felhasznalo", JSON.stringify(response.data.felhasznalo));
      setFelhasznalo(response.data.felhasznalo);

      // Kosár lekérése bejelentkezés után
      try {
        const kosarResponse = await axios.get("http://localhost:5000/kosar", {
          headers: { Authorization: `Bearer ${response.data.token}` },
        });

        console.log("Kosár betöltve a szerverről:", kosarResponse.data.kosar);

        setKosar(kosarResponse.data.kosar || []);
        localStorage.setItem("kosar", JSON.stringify(kosarResponse.data.kosar || []));
      } catch (error) {
        console.error("Hiba a kosár lekérésekor:", error.response?.data || error.message);
      }

      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Bejelentkezési hiba:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Bejelentkezés sikertelen!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Bejelentkezés</h2>
      <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" name="jelszo" placeholder="Jelszó" onChange={(e) => setJelszo(e.target.value)} required />
      <button type="submit">Bejelentkezés</button>
    </form>
  );
};

export default Bejelentkezes;
