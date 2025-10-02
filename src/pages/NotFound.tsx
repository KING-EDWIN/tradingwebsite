import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <TrendingUp className="h-16 w-16 text-primary opacity-50" />
        </div>
        <h1 className="mb-4 text-6xl font-display font-bold gradient-text">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! This trading floor doesn't exist</p>
        <Button variant="hero" onClick={() => navigate('/')} className="flex items-center mx-auto">
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
