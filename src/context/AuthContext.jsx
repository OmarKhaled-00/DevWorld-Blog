import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { ENV } from "../config/ENV";
import { replace, useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${ENV.BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const res = await axios.post(
        `${ENV.BASE_URL}/logout`,
        {},
        { withCredentials: true },
      );
      if (res.data.success) {
        setUser(null);
        navigate("/", replace);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export { AuthContext };
