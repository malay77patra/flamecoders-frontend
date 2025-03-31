import { Routes, Route } from "react-router-dom";
import Home from '@/pages/Home';
import Auth from "@/pages/Auth";
import SiteLayout from "@/components/SiteLayout";

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes >
    </SiteLayout>
  );
}

export default App;
