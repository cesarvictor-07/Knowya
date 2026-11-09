import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { obtenerUsuario, cerrarSesion } from "../services/authService";
import "../styles/profile.css";

function Profile() {
    const navigate = useNavigate();
    const usuario = obtenerUsuario();

    const handleLogout = () => {
        cerrarSesion();
        navigate("/login", { replace: true });
    };

    return (
        <main className="profile-page">
            <div className="profile-container">
                <Header />

                <h1 className="profile-logo">Knowya</h1>

                <section className="profile-content">
                    <h2>Mi perfil</h2>

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

                </section>
            </div>
        </main>
    );
}

export default Profile;
