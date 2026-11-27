import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import FeedbackModal from "../components/FeedbackModal";
import Header from "../components/Header";
import {
    obtenerUsuario,
    cerrarSesion,
    actualizarUsuario,
    eliminarUsuario,
} from "../services/authService";
import {
    obtenerInteraccionesEnviadas,
    retirarInteres,
} from "../services/peopleService";
import "../styles/profile.css";
import ThemeSwitch from "../components/ThemeSwitch";

function Profile() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(() => obtenerUsuario());

    const [formData, setFormData] = useState({
        userName: usuario?.userName || "",
        email: usuario?.email || "",
        descripcion: usuario?.descripcion || "",
    });

    const [editando, setEditando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [retirandoId, setRetirandoId] = useState(null);

    const [interacciones, setInteracciones] = useState([]);
    const [cargandoInteracciones, setCargandoInteracciones] = useState(true);
    const [errorInteracciones, setErrorInteracciones] = useState("");

    const [confirmacion, setConfirmacion] = useState(null);
    const [modal, setModal] = useState(null);

    const cargarInteracciones = useCallback(async () => {
        setCargandoInteracciones(true);
        setErrorInteracciones("");

        try {
            const datos = await obtenerInteraccionesEnviadas();
            setInteracciones(datos);
        } catch (error) {
            setErrorInteracciones(error.message);
        } finally {
            setCargandoInteracciones(false);
        }
    }, []);

    useEffect(() => {
        cargarInteracciones();
    }, [cargarInteracciones]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((datosAnteriores) => ({
            ...datosAnteriores,
            [name]: value,
        }));
    };

    const mostrarModal = (type, title, message, onClose = null) => {
        setModal({ type, title, message, onClose });
    };

    const handleModalClose = () => {
        const accion = modal?.onClose;
        setModal(null);
        accion?.();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setGuardando(true);

        try {
            const usuarioActualizado = await actualizarUsuario(formData);

            setUsuario(usuarioActualizado);
            setFormData({
                userName: usuarioActualizado.userName || "",
                email: usuarioActualizado.email || "",
                descripcion: usuarioActualizado.descripcion || "",
            });

            setEditando(false);

            mostrarModal(
                "success",
                "Perfil actualizado",
                "Tus datos se han actualizado correctamente."
            );
        } catch (error) {
            mostrarModal(
                "error",
                "No se pudo actualizar el perfil",
                error.message
            );
        } finally {
            setGuardando(false);
        }
    };

    const handleLogout = () => {
        cerrarSesion();

        mostrarModal(
            "success",
            "Cierre de sesión correcto",
            "Has cerrado sesión correctamente.",
            () => navigate("/", { replace: true })
        );
    };

    const solicitarEliminarCuenta = () => {
        setConfirmacion({ tipo: "eliminar", paso: 1 });
    };

    const solicitarRetirarInteres = (interaccion) => {
        setConfirmacion({
            tipo: "retirar",
            idDestino: interaccion.idUsuario,
            nombreUsuario: interaccion.nombreUsuario,
        });
    };

    const cancelarConfirmacion = () => {
        setConfirmacion(null);
    };

    const confirmarAccion = async () => {
        if (!confirmacion) return;

        if (confirmacion.tipo === "eliminar" && confirmacion.paso === 1) {
            setConfirmacion({ tipo: "eliminar", paso: 2 });
            return;
        }

        if (confirmacion.tipo === "eliminar") {
            setConfirmacion(null);
            setEliminando(true);

            try {
                await eliminarUsuario();

                mostrarModal(
                    "success",
                    "Cuenta eliminada",
                    "Tu cuenta y sus datos asociados se han eliminado correctamente.",
                    () => navigate("/", { replace: true })
                );
            } catch (error) {
                mostrarModal(
                    "error",
                    "No se pudo eliminar la cuenta",
                    error.message
                );
            } finally {
                setEliminando(false);
            }

            return;
        }

        if (confirmacion.tipo === "retirar") {
            const { idDestino, nombreUsuario } = confirmacion;

            setConfirmacion(null);
            setRetirandoId(idDestino);

            try {
                await retirarInteres(idDestino);

                setInteracciones((anteriores) =>
                    anteriores.map((interaccion) =>
                        interaccion.idUsuario === idDestino
                            ? { ...interaccion, estado: "RETIRADA" }
                            : interaccion
                    )
                );

                mostrarModal(
                    "success",
                    "Interés retirado",
                    `Has retirado tu interés en ${nombreUsuario}.`
                );
            } catch (error) {
                mostrarModal(
                    "error",
                    "No se pudo retirar el interés",
                    error.message
                );
            } finally {
                setRetirandoId(null);
            }
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "Fecha no disponible";

        const fechaValida = new Date(fecha);

        if (Number.isNaN(fechaValida.getTime())) {
            return "Fecha no disponible";
        }

        return fechaValida.toLocaleString("es-ES", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const obtenerContenidoConfirmacion = () => {
        if (confirmacion?.tipo === "eliminar" && confirmacion.paso === 1) {
            return {
                titulo: "¿Eliminar tu cuenta?",
                mensaje:
                    "Si continúas, iniciarás el proceso de eliminación de tu cuenta. Se borrarán tus datos personales y la información asociada.",
                boton: "Continuar",
            };
        }

        if (confirmacion?.tipo === "eliminar" && confirmacion.paso === 2) {
            return {
                titulo: "Confirmación definitiva",
                mensaje:
                    "Esta acción es irreversible. También se eliminarán tus interacciones, chats, mensajes y consultas de soporte. ¿Quieres eliminar definitivamente tu cuenta?",
                boton: "Sí, eliminar mi cuenta",
            };
        }

        if (confirmacion?.tipo === "retirar") {
            return {
                titulo: "Retirar interés",
                mensaje:
                    `¿Seguro que quieres retirar tu interés en ${confirmacion.nombreUsuario}?`,
                boton: "Sí, retirar interés",
            };
        }

        return null;
    };

    const contenidoConfirmacion = obtenerContenidoConfirmacion();

    return (
        <main className="profile-page">
            <div className="profile-container">
                <Header />

                <h1 className="profile-logo">Knowya</h1>

                <section className="profile-content">
                    <h2>Perfil</h2>

                    {editando ? (
                        <form className="profile-form" onSubmit={handleUpdate}>
                            <div className="profile-field">
                                <label htmlFor="userName">Nombre de usuario</label>
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={60}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    maxLength={80}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="descripcion">Descripción</label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    maxLength={255}
                                    rows={4}
                                    placeholder="Cuéntales algo sobre ti..."
                                />
                                <small>{formData.descripcion.length}/255 caracteres</small>
                            </div>

                            <button
                                type="submit"
                                className="profile-button"
                                disabled={guardando}
                            >
                                {guardando ? "Guardando..." : "Guardar cambios"}
                            </button>

                            <button
                                type="button"
                                className="profile-button profile-button--secondary"
                                onClick={() => {
                                    setFormData({
                                        userName: usuario?.userName || "",
                                        email: usuario?.email || "",
                                        descripcion: usuario?.descripcion || "",
                                    });
                                    setEditando(false);
                                }}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                        </form>
                    ) : (
                        <>
                            <div className="profile-data">
                                <div className="profile-field">
                                    <span>Nombre de usuario</span>
                                    <p>{usuario?.userName || usuario?.username || "No disponible"}</p>
                                </div>

                                <div className="profile-field">
                                    <span>Correo electrónico</span>
                                    <p>{usuario?.email || "No disponible"}</p>
                                </div>

                                <div className="profile-field">
                                    <span>Descripción</span>
                                    <p>{usuario?.descripcion || "Todavía no has añadido una descripción."}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="profile-button"
                                onClick={() => setEditando(true)}
                            >
                                Editar perfil
                            </button>
                        </>
                    )}

                    <details className="profile-interactions">
                        <summary>Mis intereses ({interacciones.length})</summary>

                        {cargandoInteracciones ? (
                            <p className="profile-interactions-message">
                                Cargando tus intereses...
                            </p>
                        ) : errorInteracciones ? (
                            <div className="profile-interactions-message">
                                <p>{errorInteracciones}</p>
                                <button
                                    type="button"
                                    className="profile-button profile-button--secondary"
                                    onClick={cargarInteracciones}
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : interacciones.length === 0 ? (
                            <p className="profile-interactions-message">
                                Todavía no has mostrado interés en ninguna persona.
                            </p>
                        ) : (
                            <div className="profile-interactions-list">
                                {interacciones.map((interaccion) => (
                                    <article
                                        className="profile-interaction"
                                        key={interaccion.idInteraccion}
                                    >
                                        <div className="profile-interaction-data">
                                            <strong>{interaccion.nombreUsuario}</strong>
                                            <span>
                                                Fecha: {formatearFecha(interaccion.fechaInteraccion)}
                                            </span>
                                            <span>
                                                Estado: {interaccion.estado}
                                            </span>
                                        </div>

                                        {interaccion.estado === "ACTIVA" && (
                                            <button
                                                type="button"
                                                className="profile-button profile-button--danger"
                                                onClick={() => solicitarRetirarInteres(interaccion)}
                                                disabled={
                                                    retirandoId !== null ||
                                                    eliminando
                                                }
                                            >
                                                {retirandoId === interaccion.idUsuario
                                                    ? "Retirando..."
                                                    : "Retirar interés"}
                                            </button>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </details>

                    {contenidoConfirmacion && (
                        <div
                            className="profile-confirmation"
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="profile-confirmation-title"
                            aria-describedby="profile-confirmation-message"
                        >
                            <h3 id="profile-confirmation-title">
                                {contenidoConfirmacion.titulo}
                            </h3>

                            <p id="profile-confirmation-message">
                                {contenidoConfirmacion.mensaje}
                            </p>

                            <div className="profile-confirmation-actions">
                                <button
                                    type="button"
                                    className="profile-button profile-button--secondary"
                                    onClick={cancelarConfirmacion}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    className={`profile-button ${confirmacion.tipo === "eliminar" ||
                                        confirmacion.tipo === "retirar"
                                        ? "profile-button--danger"
                                        : ""
                                        }`}
                                    onClick={confirmarAccion}
                                    disabled={eliminando || retirandoId !== null}
                                >
                                    {contenidoConfirmacion.boton}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="profile-account-actions">
                        <button
                            type="button"
                            className="profile-button"
                            onClick={handleLogout}
                            disabled={guardando || eliminando || retirandoId !== null}
                        >
                            Cerrar sesión
                        </button>

                        <button
                            type="button"
                            className="profile-button profile-button--danger"
                            onClick={solicitarEliminarCuenta}
                            disabled={guardando || eliminando || retirandoId !== null}
                        >
                            {eliminando ? "Eliminando cuenta..." : "Eliminar cuenta"}
                        </button>
                    </div>

                    <div className="profile-theme-switch">
                        <ThemeSwitch />
                    </div>
                </section>

                <FeedbackModal
                    isOpen={Boolean(modal)}
                    type={modal?.type || "success"}
                    title={modal?.title || ""}
                    message={modal?.message || ""}
                    buttonText="Entendido"
                    onClose={handleModalClose}
                />
            </div>
        </main>
    );
}

export default Profile;
