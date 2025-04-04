import React, { useState } from "react";
import Select from "react-select";
import TapInLogoWhite from "../assets/TapInLogoWhite.png";
import "./sidebar.css";

const categoryOptions = [
  { value: "food", label: "Food" },
  { value: "museum", label: "Museum" },
  { value: "nature", label: "Nature" },
  { value: "shopping", label: "Shopping" },
  { value: "stay", label: "Stay" },
];

const Sidebar = () => {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const data = {
      location,
      category: category ? category.value : "",
      description,
      priceRange: `$${"$".repeat(priceRange)}`, // Convert range to dollar signs
    };

    setLoading(true); // Start loading

    try {
      // Update test-prompt.json
      const response = await fetch("http://localhost:5001/api/update-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Failed to update test-prompt.json.");
        setLoading(false); // Stop loading
        return;
      }

      // Run test.js
      const runTestResponse = await fetch("http://localhost:5001/api/run-test", {
        method: "POST",
      });

      if (runTestResponse.ok) {
        const result = await runTestResponse.json();
        console.log(`Test.js execution: ${result.message}`);
      } else {
        alert("Failed to run test.js file.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="sidebar">
      <img
        src={TapInLogoWhite}
        alt="TapInLogo"
        height="67px"
        width="199px"
      />

      <input
        type="text"
        placeholder="enter location..."
        className="input"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <Select
        options={categoryOptions}
        placeholder="enter category..."
        classNamePrefix="dropdown"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "999px",
            height: "42px",
            paddingLeft: "5px",
            boxShadow: "none",
            fontSize: "14px",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#888",
            fontWeight: "normal",
          }),
          singleValue: (base) => ({
            ...base,
            color: "#010101",
            fontSize: "14px",
          }),
          menu: (base) => ({
            ...base,
            borderRadius: "12px",
            overflow: "hidden",
          }),
          option: (base, state) => ({
            ...base,
            color: "#010101",
            fontSize: "14px",
            backgroundColor: state.isFocused
              ? "#f0f0f0"
              : state.isSelected
              ? "#e0e0e0"
              : "white",
          }),
        }}
        value={category}
        onChange={(selectedOption) => setCategory(selectedOption)}
      />

      <input
        type="text"
        placeholder="enter description..."
        className="input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="slider-container">
        <label className="slider-label">$</label>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          className="slider"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
        <label className="slider-label">$$$</label>
      </div>

      <button className="submit-button" onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing your request...</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
