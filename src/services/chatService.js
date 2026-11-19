import { obtenerToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerChats() {
    const token = obtenerToken();

    let respuesta;

    try {
        respuesta = await fetch(`${API_URL}/chats`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch {
        throw new Error(
            "No se ha podido conectar con el servidor. Comprueba tu conexión."
        );
    }

    if (respuesta.status === 401) {
        throw new Error(
            "Tu sesión ha caducado o no es válida. Vuelve a iniciar sesión."
        );
    }

    if (!respuesta.ok) {
        throw new Error(
            "No se han podido cargar las conversaciones."
        );
    }

    const chats = await respuesta.json();

    if (!Array.isArray(chats)) {
        throw new Error("La respuesta del servidor no es válida.");
    }

    return chats;
}
