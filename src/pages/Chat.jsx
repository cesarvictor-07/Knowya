import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send, MessageCircle, User } from "lucide-react";
import FeedbackModal from "../components/FeedbackModal";
import { obtenerChat } from "../services/chatService";
import {
  obtenerMensajes,
  enviarMensaje,
} from "../services/messageService";
import { obtenerUsuario } from "../services/authService";
import "../styles/chat.css";

function Chat() {
  const { idChat } = useParams();
  const usuarioActual = obtenerUsuario();

  const [chat, setChat] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [contenido, setContenido] = useState("");

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const [feedback, setFeedback] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const messagesRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const textareaRef = useRef(null);

  const cargarConversacion = useCallback(async (mostrarCarga = true) => {
    if (mostrarCarga) {
      setCargando(true);
    }

    try {
      const [datosChat, datosMensajes] = await Promise.all([
        obtenerChat(idChat),
        obtenerMensajes(idChat),
      ]);

      setChat(datosChat);
      setMensajes(datosMensajes);
      setError("");
    } catch (err) {
      if (mostrarCarga) {
        setError(
          err.message || "No se ha podido cargar la conversación."
        );
      }
    } finally {
      if (mostrarCarga) {
        setCargando(false);
      }
    }
  }, [idChat]);

  const desplazarseAlFinal = useCallback((comportamiento = "auto") => {
    const contenedor = messagesRef.current;

    if (!contenedor) return;

    contenedor.scrollTo({
      top: contenedor.scrollHeight,
      behavior: comportamiento,
    });
  }, []);

  function handleScrollMensajes() {
    const contenedor = messagesRef.current;

    if (!contenedor) return;

    const distanciaAlFinal =
      contenedor.scrollHeight -
      contenedor.scrollTop -
      contenedor.clientHeight;

    shouldScrollRef.current = distanciaAlFinal < 100;
  }

  useEffect(() => {
    cargarConversacion();

    const intervalo = setInterval(() => {
      cargarConversacion(false);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [cargarConversacion]);

  useEffect(() => {
    if (shouldScrollRef.current) {
      desplazarseAlFinal();
    }
  }, [mensajes, desplazarseAlFinal]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    const alturaMaxima = 120;

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      alturaMaxima
    )}px`;
  }, [contenido]);

  async function handleEnviarMensaje(event) {
    event.preventDefault();

    if (!contenido.trim() || enviando || !chat?.activo) {
      return;
    }

    const textoMensaje = contenido.trim();

    setEnviando(true);

    try {
      const nuevoMensaje = await enviarMensaje(idChat, textoMensaje);

      shouldScrollRef.current = true;

      setMensajes((anteriores) => [
        ...anteriores,
        nuevoMensaje,
      ]);

      setContenido("");
    } catch (err) {
      setFeedback({
        isOpen: true,
        title: "No se ha podido enviar el mensaje",
        message: err.message || "Ha ocurrido un error inesperado.",
      });
    } finally {
      setEnviando(false);
    }
  }

  function cerrarFeedback() {
    setFeedback((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }

  if (cargando) {
    return (
      <main className="individual-chat-page">
        <div className="individual-chat-container">
          <p className="individual-chat-state">
            Cargando conversación...
          </p>
        </div>
      </main>
    );
  }

  if (error || !chat) {
    return (
      <main className="individual-chat-page">
        <div className="individual-chat-container">
          <div className="individual-chat-state">
            <MessageCircle size={40} />
            <h2>No se ha podido abrir la conversación</h2>
            <p>{error || "No se ha encontrado el chat."}</p>

            <Link
              to="/chats"
              className="individual-chat-back individual-chat-back--text"
            >
              <ArrowLeft size={17} />
              Volver a Chats
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="individual-chat-page">
      <div className="individual-chat-container">
        <div className="individual-chat-user">
          <Link
            to="/chats"
            className="individual-chat-back"
            aria-label="Volver a mis chats"
            title="Volver a mis chats"
          >
            <ArrowLeft size={25} />
          </Link>

          <div className="individual-chat-avatar">
            <User size={25} />
          </div>

          <div className="individual-chat-user-info">
            <h1>{chat.userName}</h1>

            <p className={chat.activo ? "status-active" : "status-inactive"}>
              {chat.activo
                ? "Conversación activa"
                : "Conversación inactiva"}
            </p>
          </div>
        </div>

        <section
          ref={messagesRef}
          onScroll={handleScrollMensajes}
          className="individual-chat-messages"
          aria-label="Historial de mensajes"
        >
          {mensajes.length === 0 ? (
            <div className="individual-chat-empty">
              <MessageCircle size={38} />
              <h2>¡Empieza la conversación!</h2>
              <p>Envía el primer mensaje.</p>
            </div>
          ) : (
            mensajes.map((mensaje) => {
              const esPropio =
                mensaje.idUsuario === usuarioActual?.idUser;

              return (
                <article
                  key={mensaje.idMensaje}
                  className={`message-bubble ${esPropio
                    ? "message-bubble--own"
                    : "message-bubble--other"
                    }`}
                >
                  <p>{mensaje.contenido}</p>

                  <time>
                    {new Date(mensaje.fechaEnvio).toLocaleString("es-ES", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </time>
                </article>
              );
            })
          )}
        </section>

        {chat.activo ? (
          <form
            className="individual-chat-form"
            onSubmit={handleEnviarMensaje}
          >
            <textarea
              ref={textareaRef}
              value={contenido}
              onChange={(event) => setContenido(event.target.value)}
              placeholder="Escribe un mensaje..."
              aria-label="Escribir mensaje"
              disabled={enviando}
              rows={1}
              maxLength={2000}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />

            <button
              type="submit"
              disabled={!contenido.trim() || enviando}
              aria-label="Enviar mensaje"
            >
              <Send size={21} />
            </button>
          </form>
        ) : (
          <div className="individual-chat-disabled">
            Esta conversación está inactiva. Puedes consultar
            los mensajes anteriores, pero no enviar nuevos.
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={feedback.isOpen}
        type="error"
        title={feedback.title}
        message={feedback.message}
        onClose={cerrarFeedback}
      />
    </main>
  );
}

export default Chat;
