import { obtenerToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

async function realizarPeticion(endpoint, opciones = {}) {
  const token = obtenerToken();

  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${endpoint}`, {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...opciones.headers,
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

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje =
      datos?.mensaje ||
      datos?.detail ||
      datos?.message ||
      (respuesta.status === 403
        ? "No tienes permiso para acceder a esta conversación."
        : respuesta.status === 404
          ? "No se ha encontrado la conversación."
          : respuesta.status === 409
            ? "No se pueden enviar mensajes en este chat."
            : "No se ha podido realizar la operación.");

    throw new Error(mensaje);
  }

  return datos;
}

export async function obtenerMensajes(idChat) {
  const mensajes = await realizarPeticion(
    `/chats/${idChat}/mensajes`,
    {
      method: "GET",
    }
  );

  if (!Array.isArray(mensajes)) {
    throw new Error("La respuesta de mensajes no es válida.");
  }

  return mensajes;
}

export async function enviarMensaje(idChat, contenido) {
  if (!contenido || !contenido.trim()) {
    throw new Error("El mensaje no puede estar vacío.");
  }

  return realizarPeticion(
    `/chats/${idChat}/mensajes`,
    {
      method: "POST",
      body: JSON.stringify({
        contenido: contenido.trim(),
      }),
    }
  );
}
