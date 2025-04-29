import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RendelesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRendelesData = async () => {
      try {
        const response = await axios.get("https://periferiaweb.onrender.com/rendeles/trend");
        const formatted = response.data.map(item => ({
          date: item._id,
          orders: item.count,
        }));
        setData(formatted);
      } catch (error) {
        console.error("Nem sikerült lekérni a rendelési trend adatokat:", error);
      }
    };

    fetchRendelesData();
  }, []);

  return (
    <div className="trend-kartya">
      <h3>Új rendelések napi bontásban</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#2ecc71" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RendelesChart;