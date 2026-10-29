import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <main className="home">
      <section className="home-content">
        <h1 className="home-logo">Knowya</h1>

        <p className="home-eyebrow">
          CONOCE · CONECTA · COMPARTE
        </p>

        <h2 className="home-title">
          Nuevas personas,
          <br />
          nuevas conexiones.
        </h2>

        <p className="home-description">
          Descubre personas con intereses similares,
          comparte tus aficiones y empieza nuevas
          conversaciones con Knowya.
        </p>

        <div className="home-actions">
          <Link
            to="/register"
            className="home-button home-button--primary"
          >
            Crear cuenta
          </Link>

          <Link
            to="/login"
            className="home-button home-button--secondary"
          >
            Iniciar sesión
          </Link>
        </div>

        <p className="home-footer">
          Tu próxima conexión empieza aquí.
        </p>
      </section>
    </main>
  )
}

export default Home;