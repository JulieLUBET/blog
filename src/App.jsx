import './App.css'
import AddButton from './components/AddButton'
import SocialLinks from './components/SocialLinks'
import { AntDesignOutlined } from '@ant-design/icons';
import ClickCounter from './components/ClickCounter';
import Popup from './components/Popup';
import { useState } from 'react';

function App() {
  const [isPopup, setisPopup] = useState(false);

  const handleOk = () => {setisPopup(false);
    console.log('Popup closed with OK');};

  const handleCancel = () => {setisPopup(false); 
    console.log('Popup closed with Cancel');};

  // eslint-disable-next-line no-undef
  console.log(isPopup);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="./images/jl.png" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src="./images/logo.png" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Univers Yuna</h1>
      <div className="card">
        <AddButton 
          title="Publier un article" 
          onClick={() => setisPopup(true)} 
          icon={<AntDesignOutlined />} 
        />
        <ClickCounter/>
        <Popup 
          isPopup={isPopup} 
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
        
      </div>

      <div>
        <a href="https://www.facebook.com/Univers.Yuna/" target="_blank">
          <img src="./images/facebook.png" className="picto" alt="Vite logo" />
        </a>
        <a href="https://www.instagram.com/univers.yuna/" target="_blank">
          <img src="./images/insta.png" className="picto" alt="Vite logo" />
        </a>
        <a href="https://www.tiktok.com/@universyuna" target="_blank">
          <img src="./images/tiktok.png" className="picto" alt="Vite logo" />
        </a>
        <a href="https://www.twitch.tv/universyuna" target="_blank">
          <img src="./images/twitch.png" className="picto" alt="Vite logo" />
        </a>
        <a href="https://www.youtube.com/@universyuna5667" target="_blank">
          <img src="./images/youtube.png" className="picto" alt="Vite logo" />
        </a>
      </div>
    </>
  )
}

export default App
