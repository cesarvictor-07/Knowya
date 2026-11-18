import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

function NotFound() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  }
  return (
    <main className="not-found">
      <h1>No existe una página</h1>
      <p>Escribe una ruta que lleve a una página de verdad</p>
      <p>Vuelve atrás {" "}<Link onClick={handleBack}>aquí</Link></p>
    </main>
  )
}

export default NotFound;