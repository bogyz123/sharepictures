import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import FolderTemplate from "./components/FolderTemplate";
import Homepage from "./components/Homepage";
import ImageTemplate from "./components/ImageTemplate";
import Navbar from "./components/Navbar";
import RecentUploads from "./components/RecentUploads";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/image/:id" element={<ImageTemplate />} />
          <Route path="/recentuploads" element={<RecentUploads />} />
          <Route path="/folder" element={<FolderTemplate />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
