import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { GetStarted } from "./pages/get-started";
import { Transaction } from "./pages/transaction";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/transacao" element={<Transaction />} />
    </Routes>
  );
}
