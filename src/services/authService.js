const API_URL = import.meta.env.VITE_API_URL;

async function realizarPeticion(endpoint, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${endpoint}`, {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        ...opciones.headers,
      },
    });
  } catch {
    throw new Error(
      "No se ha podido conectar con el servidor. Comprueba tu conexión."
    );
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje =
      datos?.mensaje ||
      datos?.detail ||
      datos?.message ||
      "Ha ocurrido un error al realizar la operación.";

    throw new Error(mensaje);
  }

  return datos;
}

export async function registrarUsuario(datosUsuario) {
  return realizarPeticion("/usuarios/registro", {
    method: "POST",
    body: JSON.stringify({
      userName: datosUsuario.username,
      email: datosUsuario.email,
      password: datosUsuario.password,
    }),
  });
}

export async function iniciarSesion(datosLogin) {
  const respuesta = await realizarPeticion("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({
      email: datosLogin.email,
      password: datosLogin.password,
    }),
  });

  localStorage.setItem("token", respuesta.token);
  localStorage.setItem(
    "usuario",
    JSON.stringify(respuesta.usuario)
  );

  return respuesta;
}

export function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

export function obtenerToken() {
  return localStorage.getItem("token");
}

export function obtenerUsuario() {
  const usuario = localStorage.getItem("usuario");

  return usuario ? JSON.parse(usuario) : null;
}


export async function actualizarUsuario(datosUsuario) {
  const token = obtenerToken();

  const usuarioActualizado = await realizarPeticion("/usuarios/actual", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userName: datosUsuario.userName,
      email: datosUsuario.email,
      descripcion: datosUsuario.descripcion,
    }),
  });

  localStorage.setItem(
    "usuario",
    JSON.stringify(usuarioActualizado)
  );

  return usuarioActualizado;
}

export async function eliminarUsuario() {
  const token = obtenerToken();

  await realizarPeticion("/usuarios/actual", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  cerrarSesion();
}