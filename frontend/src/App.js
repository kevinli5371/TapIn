import './App.css';
import Map from './components/map';
import TapInLogoWhite from './assets/TapInLogoWhite.png';
import Sidebar from './components/sidebar';

function App() {
  return (
    <div className = "app">
      <div className = "sidebar">
        <img src={TapInLogoWhite} alt='TapInLogo' height='67px' width='199px' style={ {opacity: 1.43} }/>
      </div>
      <Sidebar />
      <Map />
    </div>
  );
}

export default App;
