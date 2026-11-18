import { MessageSquare, UserRound, Settings, UsersRound } from "lucide-react";
import "../styles/header.css";
import { Link, useLocation } from "react-router-dom";

function Header() {

  const location = useLocation();

  const estaEnChats = location.pathname === "/chats";

  return (
    <header className="app-header">
      <nav className="header-navigation" aria-label="Navegación principal">
        {estaEnChats ? (
          <Link
            to="/people"
            className="header-icon"
            aria-label="Conocer personas"
            title="Conocer personas"
          >
            <UsersRound aria-hidden="true" />
          </Link>
        ) : (
          <Link
            to="/chats"
            className="header-icon"
            aria-label="Mensajes"
            title="Mensajes"
          >
            <MessageSquare aria-hidden="true" />
          </Link>
        )}

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
