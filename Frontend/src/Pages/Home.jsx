import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { CheckCircle, Sun, Moon, Hexagon, ArrowRight, Settings, Calendar, Star } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) return null;

  if (user) {
    if (user.role === 'ADMIN') {
      navigate('/admin-elections');
    } else {
      navigate('/voter-elections');
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200 font-sans">
      
      {/* 1. Global Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative flex items-center justify-center">
                <Hexagon className="w-8 h-8 text-indigo-950 dark:text-slate-100" strokeWidth={2} fill="currentColor" />
                <div className="absolute w-3 h-3 bg-orange-500 rounded-full" />
              </div>
              <span className="text-xl font-bold tracking-tight text-indigo-950 dark:text-slate-100">
                Vota
              </span>
            </div>

            {/* Middle Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors">How it works</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors">Pricing</a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-950 dark:hover:text-white transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-md transition-all active:scale-95 shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-48 lg:pt-40 lg:pb-56 bg-indigo-950 dark:bg-[#030712] overflow-hidden">
        {/* Subtle decorative background line */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute left-0 top-0 w-full h-full text-emerald-500/10 dark:text-emerald-500/5 preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (Copy) */}
            <div className="max-w-2xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                An online voting system <br className="hidden sm:block" />
                <span className="text-orange-500">you can trust</span>
              </h1>
              <p className="text-lg sm:text-xl text-indigo-100 dark:text-slate-400 mb-8 max-w-xl">
                Run secure, transparent, and flawless elections with our blockchain-backed voting infrastructure. Designed for organizations that demand absolute integrity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md transition-all active:scale-95 shadow-lg text-center"
                >
                  Try for free
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-transparent hover:bg-white/5 border-2 border-white/20 dark:border-slate-800 text-white font-semibold py-3 px-8 rounded-md transition-all active:scale-95 text-center"
                >
                  Contact sales
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-indigo-100 dark:text-slate-400">Easy-to-use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-indigo-100 dark:text-slate-400">Secure and anonymous voting</span>
                </div>
              </div>
            </div>

            {/* Right Column (Visual) */}
            <div className="relative lg:ml-auto">
              <div className="relative w-full max-w-md mx-auto transform -rotate-12 hover:-rotate-6 transition-transform duration-500 ease-out">
                {/* Glow effect for dark mode */}
                <div className="hidden dark:block absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
                
                {/* Floating Mobile Dashboard Container */}
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-4 bg-slate-100 dark:bg-slate-800 flex justify-center items-center">
                    <div className="w-16 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="h-8 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-md" />
                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                            <span className="text-orange-500 font-bold">A</span>
                          </div>
                          <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">B</span>
                          </div>
                          <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                        <div className="w-6 h-6 bg-orange-500 rounded-full shadow-sm flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                    <div className="h-10 w-full bg-orange-500 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Social Proof / Reviews Section */}
      <section className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 mb-24">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-none p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-sm font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              Trusted by organizations globally
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 text-center">
            <div className="pt-4 md:pt-0">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="font-bold text-slate-900 dark:text-slate-100">4.9/5 Average</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Based on 10,000+ votes</p>
            </div>
            <div className="pt-8 md:pt-0 text-2xl font-bold text-slate-300 dark:text-slate-700">
              Software Advice
            </div>
            <div className="pt-8 md:pt-0 text-2xl font-bold text-slate-300 dark:text-slate-700">
              SourceForge
            </div>
          </div>
        </div>
      </section>

      {/* 4. "How does it work?" Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-6">
              How does it work?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our intuitive platform handles the complexity of blockchain architecture behind the scenes, leaving you with a seamless three-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-slate-300 dark:border-slate-800 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm mb-6">
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">01</span>
              </div>
              <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 mb-3">Election Set-Up</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Define the rules, dates, and candidates using our self-serve builder. Securely import your voter list.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm mb-6">
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">02</span>
              </div>
              <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 mb-3">Voting</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Voters receive unique, single-use encrypted credentials. They log in and cast their ballot from any device.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm mb-6">
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">03</span>
              </div>
              <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 mb-3">Results</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Instantly audit the blockchain ledger once the election closes. Generate cryptographic proofs with zero hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tabbed Feature Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-12">
            Flexible Voting Options
          </h2>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {/* Active Tab */}
            <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-full text-orange-500 font-semibold text-sm transition-colors">
              Plurality (First-Past-the-Post)
            </button>
            {/* Inactive Tabs */}
            <button className="px-6 py-3 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
              Ranked-Choice
            </button>
            <button className="px-6 py-3 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
              Cumulative Voting
            </button>
            <button className="px-6 py-3 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-sm transition-colors">
              Secure Proxy Mapping
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-8 md:p-16 border border-slate-100 dark:border-slate-800 max-w-4xl mx-auto flex items-center justify-center min-h-[300px]">
            {/* Placeholder for tab content */}
            <div className="text-slate-500 dark:text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Configure single-winner or multi-winner plurality elections tailored for your exact bylaws.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Split Feature Block */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column (Copy) */}
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-6">
                Let us manage it for you
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Don't have the IT bandwidth to run a high-stakes election? Our enterprise team provides white-glove setup, voter support ticketing, and certified cryptographic audits.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="group flex items-center gap-2 bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold py-3 px-6 rounded-md transition-all"
              >
                See more
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right Column (Visual) */}
            <div className="relative">
              {/* Solid Green Box */}
              <div className="absolute top-8 -right-4 bottom-8 -left-4 bg-emerald-400 dark:bg-emerald-600/30 rounded-2xl transform rotate-3"></div>
              
              {/* Image Placeholder Container */}
              <div className="relative bg-slate-200 dark:bg-slate-800 rounded-2xl aspect-[4/3] overflow-hidden shadow-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                {/* Abstract visualization or photo placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 mix-blend-multiply flex items-center justify-center">
                  <span className="text-slate-400 dark:text-slate-600 font-medium">Managed Services</span>
                </div>
              </div>

              {/* Floating Purple Icon Box */}
              <div className="absolute -bottom-6 -left-6 bg-indigo-600 shadow-xl rounded-xl p-5 flex items-center justify-center animate-bounce duration-1000" style={{ animationDuration: '3s' }}>
                <Settings className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-indigo-950 dark:bg-[#030712] py-12 border-t border-indigo-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
            <span className="text-lg font-bold text-white">Vota</span>
          </div>
          <p className="text-sm text-indigo-200 dark:text-slate-500">
            © {new Date().getFullYear()} Vota. The standard in corporate voting.
          </p>
        </div>
      </footer>
    </div>
  );
}