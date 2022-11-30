

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import ImageTemplate from './components/ImageTemplate';
import Navbar from './components/Navbar';
import RecentUploads from './components/RecentUploads';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<Homepage />} path='/' />
          <Route path='/image/:id' element={<ImageTemplate />} />
          <Route path='/recentuploads' element={<RecentUploads />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
