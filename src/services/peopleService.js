
import { obtenerToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerPersonas() {
    const token = obtenerToken();

    let respuesta;

    try {
        respuesta = await fetch(`${API_URL}/usuarios`, {
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
        throw new Error("No se han podido cargar las personas.");
    }

    const personas = await respuesta.json();

    if (!Array.isArray(personas)) {
        throw new Error("La respuesta del servidor no es válida.");
    }

    return personas;
}

export async function mostrarInteres(idDestino) {
    const token = obtenerToken();

    let respuesta;

    try {
        respuesta = await fetch(`${API_URL}/interacciones/${idDestino}`, {
            method: "POST",
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

    if (respuesta.status === 409) {
        throw new Error(
            "Ya has mostrado interés en esta persona anteriormente."
        );
    }

    if (!respuesta.ok) {
        throw new Error("No se ha podido mostrar interés en esta persona.");
    }
}

export async function obtenerInteraccionesEnviadas() {
    const token = obtenerToken();

    let respuesta;

    try {
        respuesta = await fetch(`${API_URL}/interacciones/enviadas`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch {
        throw new Error(
            "No se han podido consultar tus interacciones. Comprueba tu conexión."
        );
    }

    if (respuesta.status === 401) {
        throw new Error(
            "Tu sesión ha caducado o no es válida. Vuelve a iniciar sesión."
        );
    }

    if (!respuesta.ok) {
        throw new Error("No se han podido consultar tus interacciones.");
    }

    const interacciones = await respuesta.json();

    if (!Array.isArray(interacciones)) {
        throw new Error("La respuesta de interacciones no es válida.");
    }

    return interacciones;
}
