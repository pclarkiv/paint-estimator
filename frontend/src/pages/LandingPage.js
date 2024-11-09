import React from 'react';
import { ArrowRight, Building2, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Bid Estimation
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Generate accurate construction bids in minutes, not hours. Powered by advanced AI to analyze your project documents and create detailed estimates.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Save Time</CardTitle>
                <CardDescription>
                  Generate accurate bids in minutes instead of hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                Automatic document analysis and cost calculation streamlines your estimation process.
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Increase Accuracy</CardTitle>
                <CardDescription>
                  Reduce human error with AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                Our AI technology ensures consistent and accurate cost estimations every time.
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building2 className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Scale Your Business</CardTitle>
                <CardDescription>
                  Handle more bids with the same team
                </CardDescription>
              </CardHeader>
              <CardContent>
                Process multiple projects simultaneously and grow your business efficiently.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Basic',
                price: '$99',
                features: ['5 Projects/month', 'Basic Analytics', 'Email Support'],
              },
              {
                title: 'Professional',
                price: '$299',
                features: ['20 Projects/month', 'Advanced Analytics', 'Priority Support'],
                highlighted: true,
              },
              {
                title: 'Enterprise',
                price: 'Custom',
                features: ['Unlimited Projects', 'Custom Integration', '24/7 Support'],
              },
            ].map((plan, index) => (
              <Card 
                key={index}
                className={`${
                  plan.highlighted 
                    ? 'border-2 border-blue-600 shadow-lg' 
                    : 'border border-gray-200'
                } hover:shadow-xl transition-shadow`}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{plan.title}</CardTitle>
                  <CardDescription className="text-3xl font-bold mt-2">
                    {plan.price}
                    {plan.price !== 'Custom' && <span className="text-base font-normal">/month</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full mt-6 py-2 rounded-lg font-semibold ${
                      plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    Get Started
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li>Features</li>
                <li>Pricing</li>
                <li>Case Studies</li>
                <li>Reviews</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>About</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>API Reference</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 AI Bid Estimation Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
