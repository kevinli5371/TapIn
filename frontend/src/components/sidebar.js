import React from "react";
import TapInLogoWhite from "../assets/TapInLogoWhite.png";
import "./sidebar.css";

const locationOptions = [
  { value: "new-york", label: "New York" },
  { value: "new-jersey", label: "New Jersey" },
  { value: "philadelphia", label: "Philadelphia" },
  { value: "chicago", label: "Chicago" },
];

const categoryOptions = [
  { value: "food", label: "Food" },
  { value: "museum", label: "Museum" },
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
        style={{ opacity: 1.43 }}
      />

      <input
        options={locationOptions}
        placeholder="enter location..."
        className="dropdown"
      />

      <input
        options={categoryOptions}
        placeholder="enter category..."
        className="dropdown"
      />

      <input
        options={categoryOptions}
        placeholder="enter category..."
        className="dropdown"
      />
    </div>
  );
};

export default Sidebar;
