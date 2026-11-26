import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FeedbackModal from "./FeedbackModal";
import { obtenerChats } from "../services/chatService";
import { obtenerToken, obtenerUsuario } from "../services/authService";
import { detectarNuevosMatches } from "../services/matchService";

function MatchManager() {
    const [matches, setMatches] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let activo = true;

        async function comprobarMatches() {
            const token = obtenerToken();
            const usuario = obtenerUsuario();

            if (!token || !usuario?.idUser) {
                return;
            }

            try {
                const chats = await obtenerChats();

                if (!activo) return;

                const nuevosMatches = detectarNuevosMatches(
                    usuario.idUser,
                    chats
                );

                if (nuevosMatches.length > 0) {
                    setMatches((anteriores) => {
                        const idsExistentes = new Set(
                            anteriores.map((match) => match.idChat)
                        );

                        const nuevos = nuevosMatches.filter(
                            (match) => !idsExistentes.has(match.idChat)
                        );

                        return [...anteriores, ...nuevos];
                    });
                }
            } catch (error) {
                console.error(
                    "No se han podido comprobar los nuevos Matches:",
                    error
                );
            }
        }

        comprobarMatches();

        const intervalo = setInterval(comprobarMatches, 10000);

        return () => {
            activo = false;
            clearInterval(intervalo);
        };
    }, [location.pathname]);

    const matchActual = matches[0];

    function cerrarNotificacion() {
        setMatches((anteriores) => anteriores.slice(1));
        navigate("/chats");
    }

    return (
        <FeedbackModal
            isOpen={Boolean(matchActual)}
            type="success"
            title="¡Tenéis un Match!"
            message={
                matchActual
                    ? `Tú y ${matchActual.userName} habéis mostrado interés mutuamente. ¡Se ha creado un chat!`
                    : ""
            }
            buttonText="Ir a mis chats"
            onClose={cerrarNotificacion}
        />
    );
}

export default MatchManager;
