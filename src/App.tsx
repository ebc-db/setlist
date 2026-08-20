import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import Home from "./pages/Home.tsx";
import LiveDetail from "./pages/LiveDetail.tsx";
import SongDetail from "./pages/SongDetail.tsx";
import Ranking from "./pages/Ranking.tsx";
import "./App.css";
import TagDetail from "./pages/TagDetail.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { SearchProvider } from "./context/SearchContext.tsx";

function App() {
  return (
    <SearchProvider>
      <BrowserRouter basename="/setlist">
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live/:id" element={<LiveDetail />} />
              <Route path="/song/:songName" element={<SongDetail />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/tag/:tagName" element={<TagDetail />} />
            </Routes>
          </main>
          <ScrollToTop />
        </div>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;
