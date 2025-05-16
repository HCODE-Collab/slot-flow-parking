
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="container px-4 py-6 mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-primary">Park</span>Pro
          </h1>
          <nav className="hidden md:flex space-x-4">
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
              Register
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container px-4 py-12 sm:py-24 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Smart Parking Management System
            </h2>
            <p className="text-xl text-muted-foreground">
              Streamline your parking operations with our advanced vehicle parking management solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border p-6 animate-fade-in">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="bg-primary/20 h-2 w-24 rounded-full" />
                <h3 className="text-2xl font-semibold">For Vehicle Owners</h3>
                <p className="text-muted-foreground">
                  Register your vehicles, request parking slots, and manage your parking needs all in one place.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-primary/20 h-2 w-24 rounded-full" />
                <h3 className="text-2xl font-semibold">For Facility Managers</h3>
                <p className="text-muted-foreground">
                  Efficiently manage parking slots, approve requests, and maintain an organized parking facility.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-primary/20 h-2 w-24 rounded-full" />
                <h3 className="text-2xl font-semibold">Smart Features</h3>
                <p className="text-muted-foreground">
                  Automated slot assignment, vehicle tracking, and comprehensive reporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted/30 border-t py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 ParkPro. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
