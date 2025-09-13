import React, { useContext, useMemo } from "react";
import { CareerContext } from "../../../context/CareerContext";

export default function TrendingCareersPage() {
  const { careerData, loading } = useContext(CareerContext);

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading career suggestions...</p>;

  // 📝 Extract careers dynamically (split by numbered sections)
  const careers = useMemo(() => {
    if (!careerData) return [];
    return careerData
      .split(/\*\*\d+\.\s/) // split by **1. , **2. etc.
      .slice(1) // first part is intro, skip it
      .map((block) => block.trim());
  }, [careerData]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">
        🚀 Trending Career Suggestions
      </h2>

      {/* Intro section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 shadow-md rounded-xl p-6 mb-10">
        <p className="leading-relaxed">{careerData.split("**1.")[0]}</p>
      </div>

      {/* Careers list */}
      <div className="grid md:grid-cols-2 gap-6">
        {careers.map((career, index) => {
          const [titleLine, ...details] = career.split("\n").filter((line) => line.trim());
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                {titleLine.replace(/\*\*/g, "").replace(":", "")}
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                {details.map((line, i) => (
                  <li key={i} className="border-l-4 border-indigo-400 pl-3">
                    {line.replace(/\*/g, "").trim()}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
