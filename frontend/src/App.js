import './App.css';
import Map from './components/map';
import TapInLogoWhite from './assets/TapInLogoWhite.png';

function App() {
  return (
    <div className = "app">
      <Map />
      <div className = "sidebar">
        <img src={TapInLogoWhite} alt='TapInLogo' height='67px' width='199px' style={ {opacity: 1.43} }/>
      </div>
    </div>
  );
}

export default App;
