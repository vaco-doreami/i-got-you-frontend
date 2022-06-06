import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import { Reset } from "styled-reset";
import Main from "../../pages/Main";
import CreatePlayer from "../../pages/CreatePlayer";
import RoomList from "../../pages/RoomList";
import Standby from "../../pages/Standby";

function App() {
  return (
    <>
      <GlobalStyles />
      <Reset />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/create-player" element={<CreatePlayer />} />
          <Route path="/room/list" element={<RoomList />} />
          <Route path="/room/:roomId" element={<Standby />} />
          <Route path="*" element={<Main />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
