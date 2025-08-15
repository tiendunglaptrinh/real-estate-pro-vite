import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@utils/utils";
import {Spinner} from "@components/component";

const ProtectRoute = ({ children, roleRoute }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const protectRoute = async () => {
      const current_user = await getCurrentUser();
      if (!current_user) {
        navigate("/login");
        return;
      }
      if (current_user.userRole !== roleRoute) {
        navigate("/unauthorized");
        return;
      }
      setUser(current_user);
      setLoading(false);
    };
    protectRoute();
  }, [navigate, roleRoute]);

  if (loading) return <Spinner />;
  return children;
};

export default ProtectRoute;
