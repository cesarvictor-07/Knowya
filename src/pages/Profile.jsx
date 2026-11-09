import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FeedbackModal from "../components/FeedbackModal";
import Header from "../components/Header";
import { obtenerUsuario, cerrarSesion } from "../services/authService";
import "../styles/profile.css";

function Profile() {
    const navigate = useNavigate();
    const usuario = obtenerUsuario();

    const [modalOpen, setModalOpen] = useState(false);

    const goToPeople = () => {
        navigate("/people");
    }

    const handleLogout = () => {
        cerrarSesion();
        setModalOpen(true);
    };

    return (
        <main className="profile-page">
            <div className="profile-container">
                <Header />

                <h1 className="profile-logo">Knowya</h1>

                <section className="profile-content">
                    <h2>Perfil</h2>

                    <div className="profile-data">
                        <div className="profile-field">
                            <span>Nombre de usuario</span>
                            <p>{usuario?.userName || usuario?.username || "No disponible"}</p>
                        </div>

                        <div className="profile-field">
                            <span>Correo electrónico</span>
                            <p>{usuario?.email || "No disponible"}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="profile-logout"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>

                    <button
                        type="button"
                        className="profile-logout"
                        onClick={goToPeople}
                    >
                        (Temporal) Volver a people
                    </button>

                </section>
                <FeedbackModal isOpen={modalOpen}
                    type="success"
                    title="Cierre de sesión correcto"
                    message="Has cerrado sesión correctamente!"
                    buttonText="Entendido"
                    onClose={() => {
                        setModalOpen(false);
                        navigate("/", { replace: true })
                    }} />
            </div>
        </main>
    );
}

export default Profile;
