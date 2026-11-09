import { Navigate, useLocation } from "react-router-dom";
import { obtenerToken } from "../services/authService";

function ProtectedRoute({ children }) {
    const token = obtenerToken();
    const location = useLocation();

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}

export default ProtectedRoute;
