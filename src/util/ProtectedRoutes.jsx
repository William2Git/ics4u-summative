import { Outlet, Navigate } from "react-router-dom";
import { useStoreContext } from "../context";

function ProtectedRoutes() {
  const { firstName } = useStoreContext();

  return (
    firstName ? <Outlet /> : <Navigate to="/login" />
  )
}

export default ProtectedRoutes;