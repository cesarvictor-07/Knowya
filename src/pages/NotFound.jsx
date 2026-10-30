import { Link } from "react-router-dom";
import "../styles/global.css";

function NotFound() {
  return (
    <main className="not-found">
      <h1>No existe una página</h1>
      <p>Escribe una ruta que lleve a una página de verdad</p>
      <p>Vuelve al Inicio{" "}<Link to="/">aquí</Link></p>
    </main>
  )
}

export default NotFound;