import { createContext, useState, useEffect } from "react";
import { apiurl } from "../api";
import axios from "axios";

export const CareerContext = createContext();

export default function CareerProvider({ children }) {
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch API when website loads
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await axios.get(`${apiurl}/api/chatbot/generate?prompt=AI%20careers`);
        const data = res.data.response
        console.log(data)
        setCareerData(data); // store only the response text
      } catch (error) {
        console.error("Error fetching career data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  return (
    <CareerContext.Provider value={{ careerData, loading }}>
      {children}
    </CareerContext.Provider>
  );
}
