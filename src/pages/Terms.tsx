import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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

      {/* Content */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-center">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Last updated: October 2, 2024
          </p>

          <Card className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using TradeMaster Academy ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials on TradeMaster Academy for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Educational Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                All educational content provided through TradeMaster Academy is for informational purposes only. Trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, and financial resources.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may not use our service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on TradeMaster Academy are provided on an 'as is' basis. TradeMaster Academy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall TradeMaster Academy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TradeMaster Academy, even if TradeMaster Academy or a TradeMaster Academy authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Revisions</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on TradeMaster Academy could include technical, typographical, or photographic errors. TradeMaster Academy does not warrant that any of the materials on its website are accurate, complete, or current. TradeMaster Academy may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                Phone: +256 762881027
                <br />
                Email: info@trademaster.academy
              </p>
            </section>
          </Card>
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

export default Terms;

