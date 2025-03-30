import React from "react";
import Select from "react-select";
import TapInLogoWhite from "../assets/TapInLogoWhite.png";
import "./sidebar.css";

const categoryOptions = [
  { value: "food", label: "Food" },
  { value: "museum", label: "Museum" },
  { value: "park", label: "Park" },
  { value: "shopping", label: "Shopping" },
  { value: "stay", label: "Stay" },
];

const Sidebar = () => {
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
      />

      <Select
        options={categoryOptions}
        placeholder="enter category..."
        classNamePrefix="dropdown"
      />

      <input
        type="text"
        placeholder="enter description..."
        className="input"
      />

      <div className="slider-container">
        <label className="slider-label">$</label>
        <input type="range" min="1" max="3" step="1" className="slider" />
        <label className="slider-label">$$$</label>
      </div>
    </div>
  );
};

export default Sidebar;
