import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase"; 

export function Rutas_privdas() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Cargando...</p>; 

  return user ? <Outlet /> : <Navigate to="/" />;
}

export default Rutas_privdas;
