import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import PeopleCard from "../components/PeopleCard";
import FeedbackModal from "../components/FeedbackModal";
import {
    obtenerPersonas,
    obtenerInteraccionesEnviadas,
    mostrarInteres,
} from "../services/peopleService";
import { obtenerUsuario } from "../services/authService";
import { obtenerChats } from "../services/chatService";
import { registrarMatchPendiente, eliminarMatchPendiente, marcarChatComoConocido } from "../services/matchService";
import "../styles/people.css";

function People() {
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [cargando, setCargando] = useState(true);
    const [enviandoInteres, setEnviandoInteres] = useState(false);
    const [error, setError] = useState("");

    const [feedback, setFeedback] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
        personId: null,
        match: false,
        icon: null,
    });

    useEffect(() => {
        async function cargarPersonas() {
            setCargando(true);
            setError("");

            try {
                const [datos, interacciones] = await Promise.all([
                    obtenerPersonas(),
                    obtenerInteraccionesEnviadas(),
                ]);

                const usuarioActual = obtenerUsuario();

                if (!usuarioActual?.idUser) {
                    throw new Error(
                        "No se ha podido identificar al usuario que ha iniciado sesión."
                    );
                }

                const usuariosConInteresActivo = new Set(
                    interacciones
                        .filter(
                            (interaccion) => interaccion.estado === "ACTIVA"
                        )
                        .map((interaccion) => interaccion.idUsuario)
                );

                const personasDisponibles = datos.filter(
                    (persona) =>
                        persona.idUser !== usuarioActual.idUser &&
                        !usuariosConInteresActivo.has(persona.idUser)
                );

                setPeople(personasDisponibles);
                setCurrentIndex(0);
            } catch (err) {
                setError(
                    err.message || "No se han podido cargar las personas."
                );
            } finally {
                setCargando(false);
            }
        }

        cargarPersonas();
    }, []);

    const currentPerson = people[currentIndex];

    const handleNext = () => {
        if (people.length === 0 || enviandoInteres) return;

        setCurrentIndex((prev) => (prev + 1) % people.length);
    };


    const handleMeet = async () => {
        if (!currentPerson || enviandoInteres) return;

        const persona = currentPerson;
        const usuarioActual = obtenerUsuario();

        if (!usuarioActual?.idUser) {
            setFeedback({
                isOpen: true,
                type: "error",
                title: "Error de sesión",
                message: "No se ha podido identificar al usuario.",
                personId: null,
                match: false,
                icon: null,
            });
            return;
        }

        setEnviandoInteres(true);

        registrarMatchPendiente(
            usuarioActual.idUser,
            persona.idUser
        );

        try {
            await mostrarInteres(persona.idUser);

            let chatActivo = null;

            try {
                const chats = await obtenerChats();

                chatActivo = chats.find(
                    (chat) =>
                        chat.idOtroUsuario === persona.idUser &&
                        chat.activo
                );
            } catch (error) {
                console.error(
                    "No se ha podido comprobar si se ha creado un Match:",
                    error
                );
            }

            if (chatActivo) {
                marcarChatComoConocido(
                    usuarioActual.idUser,
                    chatActivo
                );
            }

            eliminarMatchPendiente(
                usuarioActual.idUser,
                persona.idUser
            );

            if (chatActivo) {
                setFeedback({
                    isOpen: true,
                    type: "success",
                    title: "¡Tenéis un Match!",
                    message: `Tú y ${persona.userName} habéis mostrado interés mutuamente. ¡Se ha creado un chat!`,
                    personId: persona.idUser,
                    match: true,
                    icon: "♥",
                });
            } else {
                setFeedback({
                    isOpen: true,
                    type: "success",
                    title: "¡Hecho!",
                    message: `Has mostrado interés en ${persona.userName}.`,
                    personId: persona.idUser,
                    match: false,
                    icon: null,
                });
            }
        } catch (err) {
            eliminarMatchPendiente(
                usuarioActual.idUser,
                persona.idUser
            );

            setFeedback({
                isOpen: true,
                type: "error",
                title: "No se ha podido completar la operación",
                message: err.message || "Ha ocurrido un error inesperado.",
                personId: null,
                match: false,
                icon: null,
            });
        } finally {
            setEnviandoInteres(false);
        }
    };


    const handleFeedbackClose = () => {
        if (
            feedback.type === "success" &&
            feedback.personId !== null
        ) {
            const nuevasPersonas = people.filter(
                (persona) => persona.idUser !== feedback.personId
            );

            setPeople(nuevasPersonas);

            setCurrentIndex((prev) =>
                nuevasPersonas.length === 0
                    ? 0
                    : prev % nuevasPersonas.length
            );
        }

        if (feedback.match) {
            navigate("/chats");
        }

        setFeedback((prev) => ({
            ...prev,
            isOpen: false,
        }));
    };


    return (
        <main className="people-page">
            <div className="people-container">
                <Header />
                <h1 className="people-logo">Knowya</h1>

                <section
                    className="people-content"
                    aria-label="Descubrir personas"
                >
                    {cargando ? (
                        <p>Cargando personas...</p>
                    ) : error ? (
                        <div className="people-state">
                            <p>{error}</p>
                        </div>
                    ) : people.length === 0 ? (
                        <div className="people-state">
                            <h2>No hay personas disponibles</h2>
                            <p>
                                Ya has descubierto a todas las personas
                                disponibles. ¡Vuelve más adelante!
                            </p>
                        </div>
                    ) : (
                        <>
                            <PeopleCard person={currentPerson} />

                            <div className="people-actions">
                                <button
                                    type="button"
                                    className="people-button people-button--next"
                                    onClick={handleNext}
                                    disabled={enviandoInteres}
                                >
                                    Next
                                </button>

                                <button
                                    type="button"
                                    className="people-button people-button--meet"
                                    onClick={handleMeet}
                                    disabled={enviandoInteres}
                                >
                                    {enviandoInteres ? "Enviando..." : "Meet"}
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>


            <FeedbackModal
                isOpen={feedback.isOpen}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                icon={feedback.icon}
                buttonText={feedback.match ? "Ir a mis chats" : "Entendido"}
                onClose={handleFeedbackClose}
            />
        </main>
    );
}

export default People;
