import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Users, RefreshCw } from "lucide-react";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { obtenerChats } from "../services/chatService";

import "../styles/chats.css";

function Chats() {
  const [chats, setChats] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarChats() {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerChats();
      setChats(datos);
    } catch (err) {
      setError(err.message || "No se han podido cargar las conversaciones.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarChats();
  }, []);

  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const chatsFiltrados = chats.filter((chat) =>
    normalizarTexto(chat.nombreUsuario || "").includes(
      normalizarTexto(busqueda.trim())
    )
  );

  return (
    <main className="chats-page">
      <div className="chats-container">
        <Header />

        <h1 className="chats-title">Chats</h1>

        <p className="chats-subtitle">
          Tus conexiones y conversaciones
        </p>

        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar conversación..."
          ariaLabel="Buscar conversaciones por nombre"
        />

        <section className="chats-list-section" aria-label="Lista de conversaciones">
          {cargando ? (
            <div className="chats-state">
              <div className="chats-loader" aria-hidden="true"></div>
              <p>Cargando conversaciones...</p>
            </div>
          ) : error ? (
            <div className="chats-state chats-error">
              <MessageCircle size={40} aria-hidden="true" />

              <h2>No se han podido cargar los chats</h2>
              <p>{error}</p>

              <button
                className="chats-retry-button"
                onClick={cargarChats}
                type="button"
              >
                <RefreshCw size={17} aria-hidden="true" />
                Reintentar
              </button>
            </div>
          ) : chats.length === 0 ? (
            <div className="chats-state chats-empty">
              <Users size={48} aria-hidden="true" />

              <h2>Aún no tienes conversaciones</h2>

              <p>
                Conoce gente nueva y descubre personas con las que
                compartir intereses.
              </p>

              <Link to="/people" className="chats-people-button">
                Conocer personas
              </Link>
            </div>
          ) : chatsFiltrados.length === 0 ? (
            <div className="chats-state chats-no-results">
              <MessageCircle size={40} aria-hidden="true" />

              <h2>No se han encontrado conversaciones</h2>

              <p>
                No hay ningún chat que coincida con "{busqueda}".
              </p>

              <button
                type="button"
                className="chats-clear-search"
                onClick={() => setBusqueda("")}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="chats-list">
              {chatsFiltrados.map((chat) => (
                <article className="chat-card" key={chat.idChat}>
                  <div className="chat-avatar" aria-hidden="true">
                    <Users size={25} />
                  </div>

                  <div className="chat-info">
                    <h2 className="chat-name">{chat.nombreUsuario}</h2>

                    <span
                      className={`chat-status ${chat.activo ? "chat-status-active" : "chat-status-inactive"
                        }`}
                    >
                      <span className="chat-status-dot"></span>
                      {chat.activo ? "Interés mutuo" : "Interés pendiente"}
                    </span>
                  </div>

                  <div className="chat-card-icon" aria-hidden="true">
                    <MessageCircle size={22} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Chats;