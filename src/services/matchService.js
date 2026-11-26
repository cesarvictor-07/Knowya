const obtenerClave = (idUsuario) =>
    `knowya_chats_conocidos_${idUsuario}`;

const obtenerClavePendientes = (idUsuario) =>
    `knowya_matches_pendientes_${idUsuario}`;

function leerEstadoChats(idUsuario) {
    try {
        const datos = localStorage.getItem(obtenerClave(idUsuario));
        return datos ? JSON.parse(datos) : null;
    } catch {
        return null;
    }
}

function guardarEstadoChats(idUsuario, estado) {
    localStorage.setItem(
        obtenerClave(idUsuario),
        JSON.stringify(estado)
    );
}

function leerPendientes(idUsuario) {
    try {
        const datos = localStorage.getItem(obtenerClavePendientes(idUsuario));
        return datos ? JSON.parse(datos) : [];
    } catch {
        return [];
    }
}

function guardarPendientes(idUsuario, pendientes) {
    localStorage.setItem(
        obtenerClavePendientes(idUsuario),
        JSON.stringify(pendientes)
    );
}

export function registrarMatchPendiente(idUsuario, idOtroUsuario) {
    const pendientes = leerPendientes(idUsuario);
    const id = String(idOtroUsuario);

    if (!pendientes.includes(id)) {
        pendientes.push(id);
        guardarPendientes(idUsuario, pendientes);
    }
}

export function eliminarMatchPendiente(idUsuario, idOtroUsuario) {
    const pendientes = leerPendientes(idUsuario);
    const id = String(idOtroUsuario);

    guardarPendientes(
        idUsuario,
        pendientes.filter((pendiente) => pendiente !== id)
    );
}

function crearEstadoActual(chats) {
    return Object.fromEntries(
        chats.map((chat) => [
            String(chat.idChat),
            Boolean(chat.activo),
        ])
    );
}

export function detectarNuevosMatches(idUsuario, chats) {
    const estadoAnterior = leerEstadoChats(idUsuario);
    const estadoActual = crearEstadoActual(chats);
    const pendientes = leerPendientes(idUsuario);

    if (!estadoAnterior) {
        guardarEstadoChats(idUsuario, estadoActual);
        return [];
    }

    const nuevosMatches = chats.filter((chat) => {
        if (!chat.activo) return false;

        const estadoAnteriorChat =
            estadoAnterior[String(chat.idChat)];

        const esNuevoOReactivado =
            estadoAnteriorChat === undefined ||
            estadoAnteriorChat === false;

        const estaPendiente = pendientes.includes(
            String(chat.idOtroUsuario)
        );

        return esNuevoOReactivado && !estaPendiente;
    });

    // Guardamos el estado actual para evitar repetir avisos.
    guardarEstadoChats(idUsuario, estadoActual);

    // Si un chat pendiente ya está activo, el detector global
    // deja que People gestione el aviso y elimina esa marca.
    const pendientesRestantes = pendientes.filter((idPendiente) => {
        const chatActivo = chats.some(
            (chat) =>
                String(chat.idOtroUsuario) === idPendiente &&
                chat.activo
        );

        return !chatActivo;
    });

    guardarPendientes(idUsuario, pendientesRestantes);

    return nuevosMatches;
}

export function marcarChatComoConocido(idUsuario, chat) {
    const estado = leerEstadoChats(idUsuario) || {};

    estado[String(chat.idChat)] = Boolean(chat.activo);

    guardarEstadoChats(idUsuario, estado);
}
