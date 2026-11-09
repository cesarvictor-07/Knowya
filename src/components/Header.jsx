import { MessageSquare, UserRound, Settings } from "lucide-react";
import "../styles/header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="app-header">
      <nav className="header-navigation" aria-label="Navegación principal">
        <span className="header-icon" aria-label="Mensajes" title="Mensajes">
          <MessageSquare aria-hidden="true" />
        </span>

        <Link to="/profile" className="header-icon" aria-label="Perfil" title="Perfil">
          <UserRound aria-hidden="true" />
        </Link>

        <span
          className="header-icon"
          aria-label="Configuración"
          title="Configuración"
        >
          <Settings aria-hidden="true" />
        </span>
      </nav>
    </header>
  );
}

export default Header;
