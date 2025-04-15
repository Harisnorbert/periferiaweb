
import React, { useState, useEffect } from "react";

const PhoneInput = ({ onChange, defaultCountryCode = "+36", defaultNumber = "" }) => {
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [telefon, setPhoneNumber] = useState(defaultNumber);

  useEffect(() => {
    onChange(`${countryCode}${telefon}`);
  }, [countryCode, telefon, onChange]);

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <select
        class="telefon"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        style={{ padding: "4px" }}
      >
        <option value="+36">+36 (HU)</option>
        <option value="+44">+44 (UK)</option>
        <option value="+49">+49 (DE)</option>
      </select>

      <input
        type="text"
        value={telefon}
        maxLength={9}
        placeholder="Telefonszám"
        onChange={(e) => {
          const onlyDigits = e.target.value.replace(/\D/g, "");
          setPhoneNumber(onlyDigits);
        }}
        style={{ padding: "4px", flex: "1" }}
      />
    </div>
  );
};

export default PhoneInput;
