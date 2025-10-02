import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Loan List", exact: true },
    { path: "/validation", label: "Manual Validation" },
  ];
  
  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-primary">RBI Loan Origination Tracker</h1>
            <nav className="flex space-x-4">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    size="sm"
                  >
                    <Link to={item.path}>{item.label}</Link>
                  </Button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>User #1234</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};