
import { useState } from "react";
import { Link } from "react-router-dom";
import FeedbackModal from "../components/FeedbackModal";
import "../styles/auth.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio.";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Debe tener al menos 3 caracteres.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Introduce un email válido.";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Debe tener al menos 8 caracteres.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
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

          <h2 className="auth-title">Crear cuenta</h2>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Introduce tu nombre"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={
                errors.username ? "username-error" : undefined
              }
            />

            {errors.username && (
              <p id="username-error" className="form-error" role="alert">
                {errors.username}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>

            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "register-email-error" : undefined
              }
            />

            {errors.email && (
              <p
                id="register-email-error"
                className="form-error"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="register-password">Contraseña</label>

            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "register-password-error" : undefined
              }
            />

            {errors.password && (
              <p
                id="register-password-error"
                className="form-error"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmar contraseña
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
            />

            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="form-error"
                role="alert"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button type="submit" className="auth-button">
            Crear cuenta
          </button>

        </form>

        <p className="auth-alternative">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login">Inicia sesión</Link>
        </p>

      </section>

      <FeedbackModal
        isOpen={modalOpen}
        type="success"
        title="Registro correcto!"
        message="Todos los datos son válidos, tu cuenta se ha creado, bienvenido!"
        buttonText="Entendido"
        onClose={() => setModalOpen(false)}
      />

    </main>
  );
}

export default Register;
