import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { removeToken } from "@/lib/auth";

function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    navigate("/login", { replace: true });
  };
  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;
