import { Routes, Route } from "react-router-dom";
import Home from '@/pages/Home';
import Auth from "@/pages/Auth";
import About from "@/pages/About";
import SiteLayout from "@/components/SiteLayout";

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
      </Routes >
    </SiteLayout>
  );
}

export default App;
