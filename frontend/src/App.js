import './App.css';
import Map from './components/map';
import TapInLogoWhite from './assets/TapInLogoWhite.png';
import Sidebar from './components/sidebar';

import React, { useState } from 'react';
import data from './test.geojson';
// import axios from 'axios';

function App() {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const handlePrompt = async (prompt) => {
    console.log("pretend api called here")
  }

  return (
    <div className = "app">
      <div className = "sidebar">
        <img src={TapInLogoWhite} alt='TapInLogo' height='67px' width='199px' style={ {opacity: 1.43} }/>
      </div>
      <Sidebar />
      <Map geoJsonData={data} />
    </div>
  );
}

export default App;
