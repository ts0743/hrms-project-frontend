import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
            <span className="text-6xl font-display font-bold text-primary">404</span>
          </div>
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
            Page Not Found
          </h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Attempted URL: <code>{location.pathname}</code>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild aria-label="Go to Dashboard">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
