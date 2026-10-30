import { useTheme } from "../context/ThemeContext";
import "../styles/theme-switch.css";

function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <button className="theme-switch"
            onClick={toggleTheme}
            aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
            aria-pressed={isDark}>
            <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
            <span>{isDark ? "Modo oscuro" : "Modo claro"}</span>
        </button>
    );
}

export default ThemeSwitch;