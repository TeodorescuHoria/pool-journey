import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Solo from "./pages/Solo";
import Rules from "./pages/Rules";
import Cards from "./pages/Cards";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/joc" element={<Game />} />
      <Route path="/antrenament" element={<Solo />} />
      <Route path="/reguli" element={<Rules />} />
      <Route path="/carti" element={<Cards />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
