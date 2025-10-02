import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, ArrowLeft, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Have questions about our trading courses? Need help getting started? 
            We're here to help you succeed in your trading journey.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="glass-card p-8 text-center hover-lift">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground mb-4">
                Call us for immediate assistance
              </p>
              <a 
                href="tel:+256762881027" 
                className="text-primary font-semibold text-lg hover:underline"
              >
                +256 762881027
              </a>
            </Card>

            <Card className="glass-card p-8 text-center hover-lift">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">
                Send us a detailed message
              </p>
              <a 
                href="mailto:info@trademaster.academy" 
                className="text-primary font-semibold text-lg hover:underline"
              >
                info@trademaster.academy
              </a>
            </Card>

            <Card className="glass-card p-8 text-center hover-lift">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-muted-foreground mb-2">
                Monday - Friday
              </p>
              <p className="text-primary font-semibold">
                9:00 AM - 6:00 PM EAT
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Send us a <span className="gradient-text">Message</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <Card className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows={6}
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do I get started with TradeMaster Academy?",
                answer: "Simply click 'Get Started' on our homepage, create an account, and you'll have immediate access to our video library and trading resources."
              },
              {
                question: "Do I need prior trading experience?",
                answer: "No! Our courses are designed for all skill levels, from complete beginners to experienced traders looking to refine their strategies."
              },
              {
                question: "What trading strategies do you teach?",
                answer: "We cover technical analysis, risk management, fundamental analysis, and various trading strategies used by professional traders."
              },
              {
                question: "Is there a mobile app available?",
                answer: "Our platform is fully responsive and works great on mobile devices. You can access all features through your mobile browser."
              },
              {
                question: "How often is new content added?",
                answer: "We regularly add new video lessons, market analysis, and trading strategies to keep our content fresh and relevant."
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "We offer a satisfaction guarantee. Contact us within 30 days if you're not completely satisfied with our service."
              }
            ].map((faq, index) => (
              <Card key={index} className="glass-card p-6 hover-lift">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
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
    </div>
  );
};

export default Contact;
