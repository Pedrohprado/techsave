import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Transaction } from "./pages/transaction";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/transacao" element={<Transaction />} />
    </Routes>
  );
}
