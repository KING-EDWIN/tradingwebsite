import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TokenAuthModal from "@/components/TokenAuthModal";
import { TrendingUp, BarChart3, Target, Shield, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    navigate('/dashboard');
  };

  const handleSignIn = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold gradient-text">TradeMaster Academy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">About</Button>
            <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
            <Button variant="hero" onClick={handleSignIn}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        <div className="chart-grid absolute inset-0 opacity-20" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Master the <span className="gradient-text">Markets</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-light mb-8 text-muted-foreground max-w-3xl mx-auto">
              Learn Trading with Precision
            </h2>
            <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
              Get access to exclusive trading lessons and strategies from professional traders. 
              Master technical analysis, risk management, and profitable trading systems.
            </p>
            
            <div className="flex justify-center mb-16">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={handleSignIn}
              >
                Start Learning Today
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, label: "Active Traders", value: "30+" },
              { icon: BookOpen, label: "Video Lessons", value: "50+" },
              { icon: Target, label: "Success Rate", value: "87%" }
            ].map((stat, index) => (
              <Card key={index} className="glass-card p-6 hover-lift animate-float" 
                    style={{ animationDelay: `${index * 0.2}s` }}>
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Why Choose <span className="gradient-text">TradeMaster</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional trading education designed to transform beginners into confident traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Learn to read charts, identify patterns, and use technical indicators like a pro trader."
              },
              {
                icon: Shield,
                title: "Risk Management",
                description: "Master position sizing, stop losses, and portfolio management strategies."
              },
              {
                icon: Target,
                title: "Proven Strategies",
                description: "Access battle-tested trading strategies used by successful institutional traders."
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-card p-8 hover-lift group">
                <div className="h-12 w-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-lg font-display font-semibold">TradeMaster Academy</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="/about" className="hover:text-primary transition-colors">About</a>
              <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
              <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 TradeMaster Academy. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <TokenAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Landing;