"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Star, Shield, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/supabase/client';
import { User } from '@supabase/auth-helpers-nextjs';

export default function LandingPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [, setIsClient] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    async function getUserData() {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    
    getUserData();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase.auth]);
  
  // Demo tabs
  const demoTabs = [
    {
      persona: "Professional Writer",
      original: "I think your product is good and people will like it.",
      rewritten: "Your innovative product stands out in a competitive market, offering unparalleled value that resonates deeply with your target audience."
    },
    {
      persona: "Social Media Influencer",
      original: "This new phone has nice features and looks good.",
      rewritten: "OMG guys! 😍 This phone is EVERYTHING! The camera is insane and I'm literally obsessed with how sleek it looks. A total game-changer! #MustHave #Blessed"
    },
    {
      persona: "Academic Scholar",
      original: "Climate change is happening and has many effects.",
      rewritten: "Empirical evidence demonstrates that anthropogenic climate change manifests through a multitude of interconnected phenomena, precipitating significant ecological, social, and economic ramifications across global ecosystems."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Marketing Manager",
      image: "/testimonial-1.jpg",
      quote: "This tool has revolutionized our content strategy. We've seen a 40% increase in engagement since incorporating AI-rewritten content!"
    },
    {
      name: "Michael Chen",
      role: "Freelance Copywriter",
      image: "/testimonial-2.jpg",
      quote: "As someone who writes in multiple voices for different clients, this tool has become indispensable. It's like having an entire writing team at my fingertips."
    },
    {
      name: "Jessica Williams",
      role: "Social Media Director",
      image: "/testimonial-3.jpg",
      quote: "The persona-based rewriting has helped us maintain consistent brand voice across all our channels while saving hours of editing time."
    }
  ];
  
  // Features
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      title: "AI-Powered Transformation",
      description: "Advanced AI models analyze your content and rewrite it while preserving your core message."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      title: "Custom Personas",
      description: "Create and save your own custom writing styles in addition to our pre-built professional personas."
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      title: "Lightning Fast",
      description: "Get your rewritten content in seconds, not minutes, no matter how complex the transformation."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Data Privacy",
      description: "Your content never gets stored or used for training. What you write stays private and secure."
    }
  ];
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.div 
              className="inline-block mb-6"
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                <Sparkles className="h-4 w-4 inline mr-2" />
                Content that captivates, powered by AI
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              Transform Your Content with AI Magic
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
              Instantly rewrite your content in countless styles and voices, from professional to creative, academic to casual, all with a single click.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/content">
                    Start Rewriting Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {!user ? (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-slate-300 hover:border-slate-400 text-lg px-8 py-6 rounded-xl"
                  >
                    <Link href="/auth/signup">
                      Create Free Account
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-slate-300 hover:border-slate-400 text-lg px-8 py-6 rounded-xl"
                  >
                    <Link href="/content">
                      Go to Dashboard
                    </Link>
                  </Button>
                )}
              </motion.div>
            </div>
            
            {/* Demo preview */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-800 p-2 flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-4">
                <div className="flex mb-4 border-b border-slate-200">
                  {demoTabs.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveDemoTab(index)}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeDemoTab === index
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {tab.persona}
                    </button>
                  ))}
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDemoTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                      <div className="bg-slate-50 p-5 rounded-lg">
                        <div className="text-sm font-medium text-slate-500 mb-2">Original Content:</div>
                        <div className="text-slate-800">
                          {demoTabs[activeDemoTab].original}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                        <div className="text-sm font-medium text-blue-600 mb-2">After AI Rewrite:</div>
                        <div className="text-slate-800">
                          {demoTabs[activeDemoTab].rewritten}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Perfect Content
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our advanced AI understands context, tone, and style to transform your writing while preserving your message.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="p-3 bg-slate-50 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Content Creators
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what our users are saying about how our tool has transformed their content creation process.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 mr-4 overflow-hidden">
                    {/* Replace with actual images when available */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic">{testimonial.quote}</p>
                <div className="flex mt-4 text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of content creators who are saving time and improving their writing with our AI-powered rewriting tool.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/content">
                  Start Rewriting Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-4">
              Flexible Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Choose the Plan That Works for You
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From casual writers to professional content teams, we have pricing options to fit your needs.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Free Plan */}
            <motion.div 
              className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-6 border-b border-slate-100">
                <div className="text-slate-600 font-medium mb-1">Free</div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-600 ml-1">/month</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Perfect for occasional users</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>1,000 AI credits monthly</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Basic personas</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Text export</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="w-full"
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Pro Plan */}
            <motion.div 
              className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-600 shadow-xl overflow-hidden relative"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute -top-1 -right-12 transform rotate-45">
                <div className="bg-blue-600 text-white py-1 px-12 text-xs font-medium">
                  Most Popular
                </div>
              </div>
              <div className="p-6 border-b border-blue-200">
                <div className="text-blue-800 font-medium mb-1">Professional</div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-slate-900">$29.99</span>
                  <span className="text-slate-600 ml-1">/month</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">Perfect for content professionals</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>10,000 AI credits monthly</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>All standard personas</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Custom personas</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>WordPress integration</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Button 
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Link href="/pricing">Upgrade Now</Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Business Plan */}
            <motion.div 
              className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-6 border-b border-slate-100">
                <div className="text-slate-600 font-medium mb-1">Business</div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-slate-900">$59.99</span>
                  <span className="text-slate-600 ml-1">/month</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">For teams and businesses</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>25,000 AI credits monthly</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="w-full"
                >
                  <Link href="/pricing">View Details</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center mt-10"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button 
              asChild
              variant="link" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              <Link href="/pricing" className="flex items-center">
                View full pricing details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">Content Rewriter</h3>
              <p className="mb-4">Transform your content with AI-powered rewriting in different personas and styles.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="hover:text-white transition-colors">AI Models</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Custom Personas</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Content Export</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">WordPress Integration</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center">
            <p>&copy; {new Date().getFullYear()} Content Rewriter. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add the custom animation classes */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 30px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 15s linear infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}