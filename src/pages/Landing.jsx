import { Link } from 'react-router-dom'
import { Zap, Clock, Cloud, ArrowRight, Star, Target, Sparkles } from 'lucide-react'
import { useState } from 'react'

const Landing = () => {
  const [showDemo, setShowDemo] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600 animate-bounce" />,
      title: 'Smart Task Management',
      description:
        'Organize, prioritize, and track your tasks with intelligent categorization and automated workflows.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />,
      title: 'AI-Powered Suggestions',
      description:
        'Get intelligent recommendations for task optimization, deadline management, and productivity improvements.',
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600 animate-spin-slow" />,
      title: 'Time Tracking',
      description:
        'Monitor time spent on tasks with automatic tracking and detailed analytics to boost productivity.',
    },
    {
      icon: <Cloud className="w-8 h-8 text-indigo-600 animate-float" />,
      title: 'Cloud-Ready',
      description:
        'Access your tasks anywhere with real-time synchronization and secure cloud storage.',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Engineering Manager',
      company: 'TechCorp',
      content:
        'SprintSync transformed how our team manages sprints. The AI suggestions are incredibly accurate.',
      rating: 5,
    },
    {
      name: 'Mike Rodriguez',
      role: 'Product Owner',
      company: 'StartupXYZ',
      content:
        'Finally, a task manager that understands engineering workflows. Game-changer for our productivity.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SprintSync</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
              onClick={() => setShowDemo(false)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">SprintSync Demo</h3>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="SprintSync Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-64 rounded-lg border"
              ></iframe>
            </div>
            <p className="text-gray-600">
              See how SprintSync can supercharge your team’s productivity!
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="gradient-bg py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Plan, Track, and
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                Succeed{' '}
              </span>
              with SprintSync
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The AI-powered task manager for modern engineering teams. Streamline your workflow,
              boost productivity, and deliver results faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* <button className="btn-secondary text-lg px-8 py-4" onClick={() => setShowDemo(true)}>
                Watch Demo
              </button> */}
              <button
                className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
                onClick={async () => {
                  setAiLoading(true)
                  setAiSuggestion('')
                  setTimeout(() => {
                    setAiSuggestion(
                      'Try breaking down large tasks into smaller, actionable steps for better progress tracking!'
                    )
                    setAiLoading(false)
                  }, 1200)
                }}
              >
                <span>Try AI Suggestion</span>
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
              </button>
            </div>
            {aiLoading && <div className="mt-4 text-purple-600 animate-pulse">Thinking...</div>}
            {aiSuggestion && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg px-6 py-4 max-w-xl mx-auto text-purple-800 animate-fade-in">
                <span className="font-semibold">AI Suggestion:</span> {aiSuggestion}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Trusted By Carousel */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="flex items-center mb-4 justify-center">
            <span className="text-gray-500 text-sm mr-4">Trusted by:</span>
          </div>
          <div className="overflow-hidden relative w-full flex justify-center">
            <div
              style={{ width: '100%', maxWidth: 700, display: 'flex', justifyContent: 'center' }}
            >
              <div
                className="flex gap-6 items-center animate-scroll-x"
                style={{
                  animation: 'scrollX 12s linear infinite',
                  minWidth: '100%',
                }}
              >
                {[
                  { src: '/google.png', alt: 'Google' },
                  { src: '/ups.png', alt: 'UPS' },
                  { src: '/coca.png', alt: 'Coca Cola' },
                  { src: '/placeholder-logo.svg', alt: 'Placeholder' },
                  // Repeat for seamless loop
                  { src: '/google.png', alt: 'Google' },
                  { src: '/ups.png', alt: 'UPS' },
                  { src: '/coca.png', alt: 'Coca Cola' },
                  { src: '/placeholder-logo.svg', alt: 'Placeholder' },
                ].map((logo, idx) => (
                  <img
                    key={idx}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-16 object-contain bg-white rounded shadow-sm mx-3"
                    style={{ maxWidth: 160 }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <style>{`
            @keyframes scrollX {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll-x {
              width: max-content;
            }
          `}</style>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in 3 simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card animate-fade-in">
              <div className="mb-4">
                <Zap className="w-10 h-10 text-blue-600 animate-bounce" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Sign Up</h3>
              <p className="text-gray-600">
                Create your free account in seconds. No credit card required.
              </p>
            </div>
            <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="mb-4">
                <Target className="w-10 h-10 text-purple-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Add Tasks</h3>
              <p className="text-gray-600">
                Import or create tasks, set priorities, and assign deadlines.
              </p>
            </div>
            <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="mb-4">
                <Sparkles className="w-10 h-10 text-green-600 animate-spin-slow" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Get AI Suggestions</h3>
              <p className="text-gray-600">
                Let our AI optimize your workflow and help you deliver faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage tasks effectively
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for engineering teams and modern workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:scale-105 transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-purple-600 mb-2">50M+</div>
              <div className="text-gray-600">Tasks Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by engineering teams worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to transform your team&apos;s productivity?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of engineering teams already using SprintSync to deliver better results.
          </p>
          <Link
            to="/signup"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 group"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SprintSync</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 text-gray-400">
              <span>© 2025 SprintSync. All rights reserved.</span>
              <span className="hidden md:inline mx-2">|</span>
              <a href="mailto:contact@sprintsync.com" className="hover:underline text-blue-300">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
