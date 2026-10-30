import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import FeedbackModal from "../components/FeedbackModal";

function LogIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  
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
  };

  const handleSubmit = (e) => {
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

    if (Object.keys(newErrors).length === 0) {
      setModalOpen(true);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-container">

        <header className="auth-header">
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

          <button type="submit" className="auth-button">
            Log In
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
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}

export default LogIn;