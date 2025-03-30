import React from "react";
import Select from "react-select";
import TapInLogoWhite from "../assets/TapInLogoWhite.png";
import "./sidebar.css";

const categoryOptions = [
  { value: "food", label: "Food" },
  { value: "museum", label: "Museum" },
  { value: "nature", label: "Nature"},
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
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "999px",
            height:  "42px",
            paddingLeft: "5px",
            boxShadow: "none",
            fontSize: "14px",
          }),
          placeholder: (base)=> ({
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
      
      <button className="submit-button">
        Submit
      </button>
    </div>
  );
};

export default Sidebar;
