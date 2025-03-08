import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar";

export default function Main() {
  return (
    <div className="root-layout">
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
