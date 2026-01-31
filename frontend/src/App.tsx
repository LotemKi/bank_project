import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage.tsx";
import Signup from "./pages/SignupPage.tsx";
import Transactions from "./pages/TransactionsPage.tsx";
import Transfer from "./pages/TransferPage.tsx";

function App() {

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transfer" element={<Transfer />} />

      </Routes>
  );
}

export default App;