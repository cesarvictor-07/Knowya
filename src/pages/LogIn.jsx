import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/authService";
import "../styles/auth.css";
import FeedbackModal from "../components/FeedbackModal";
import ThemeSwitch from "../components/ThemeSwitch";

function LogIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Introduce un correo electrónico válido.";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setErrors({});
    setServerError("");
    setIsLoading(true);

    try {
      await iniciarSesion(formData);
      setModalOpen(true);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-container">

        <header className="auth-header">
          <ThemeSwitch />
          <p className="auth-welcome">Welcome</p>
          <p className="auth-to">to</p>

          <h1 className="auth-logo">Knowya</h1>

          <h2 className="auth-title">Inicia Sesión</h2>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />

            {errors.email && (
              <p id="email-error" className="form-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Introduce tu contraseña"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
            />

            {errors.password && (
              <p id="password-error" className="form-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {serverError && (
            <p className="form-error" role="alert">
              {serverError}
            </p>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Iniciando sesión" : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-alternative">
          ¿No tienes una cuenta?{" "}
          <Link to="/register">Regístrate</Link>
        </p>

      </section>
      <FeedbackModal
        isOpen={modalOpen}
        type="success"
        title="Todo correcto!"
        message="Las credenciales son correctas, has iniciado sesión correctamente"
        buttonText="Entendido"
        onClose={() => {
          setModalOpen(false);
          navigate("/people");
        }}
      />
    </main>
  );
}

export default LogIn;