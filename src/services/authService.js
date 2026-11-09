
const API_URL = import.meta.env.VITE_API_URL;

// Función común para realizar peticiones HTTP
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

// Registrar un usuario
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

// Iniciar sesión
export async function iniciarSesion(datosLogin) {
  const respuesta = await realizarPeticion("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({
      email: datosLogin.email,
      password: datosLogin.password,
    }),
  });

  // Guardar el token JWT y los datos del usuario
  sessionStorage.setItem("token", respuesta.token);
  sessionStorage.setItem(
    "usuario",
    JSON.stringify(respuesta.usuario)
  );

  return respuesta;
}

// Cerrar sesión
export function cerrarSesion() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuario");
}

// Recuperar el token almacenado
export function obtenerToken() {
  return sessionStorage.getItem("token");
}

// Recuperar los datos del usuario
export function obtenerUsuario() {
  const usuario = sessionStorage.getItem("usuario");

  return usuario ? JSON.parse(usuario) : null;
}
