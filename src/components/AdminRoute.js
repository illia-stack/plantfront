import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h1>Loading...</h1>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}