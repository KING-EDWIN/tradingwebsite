import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, Target, Users, BookOpen, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold gradient-text">TradeMaster Academy</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            About <span className="gradient-text">TradeMaster</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Empowering traders with professional education and cutting-edge tools to master the financial markets.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-8">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              At TradeMaster Academy, we believe that successful trading is not about luck, but about education, 
              discipline, and the right tools. Our mission is to democratize professional trading education, 
              making it accessible to everyone regardless of their background or experience level.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We combine decades of institutional trading experience with modern technology to create 
              comprehensive learning programs that transform beginners into confident, profitable traders.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Education First",
                description: "We believe knowledge is the foundation of successful trading. Our curriculum is designed by professional traders with decades of experience."
              },
              {
                icon: Shield,
                title: "Risk Management",
                description: "Protecting capital is paramount. We teach comprehensive risk management strategies used by institutional traders."
              },
              {
                icon: Target,
                title: "Proven Results",
                description: "Our strategies are battle-tested in real markets. We focus on methods that have consistently delivered results."
              },
              {
                icon: Users,
                title: "Community",
                description: "Trading can be isolating. We foster a supportive community where traders learn from each other and grow together."
              },
              {
                icon: BarChart3,
                title: "Innovation",
                description: "We stay at the forefront of trading technology and techniques, incorporating the latest tools and methodologies."
              },
              {
                icon: TrendingUp,
                title: "Continuous Growth",
                description: "Markets evolve constantly. We provide ongoing education to help our students adapt and thrive in changing conditions."
              }
            ].map((value, index) => (
              <Card key={index} className="glass-card p-8 hover-lift group">
                <div className="h-12 w-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">
              Our <span className="gradient-text">Impact</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, label: "Active Traders", value: "30+", description: "Growing community of dedicated learners" },
              { icon: BookOpen, label: "Video Lessons", value: "50+", description: "Comprehensive educational content" },
              { icon: Target, label: "Success Rate", value: "87%", description: "Students achieving their trading goals" }
            ].map((stat, index) => (
              <Card key={index} className="glass-card p-8 text-center hover-lift">
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                <div className="text-muted-foreground text-sm">{stat.description}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Start Your <span className="gradient-text">Trading Journey?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of traders who have transformed their financial future with TradeMaster Academy.
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => navigate('/')}
          >
            Get Started Today
          </Button>
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
    </div>
  );
};

export default About;
