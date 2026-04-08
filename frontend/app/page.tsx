import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 selection:bg-green-100 selection:text-green-900">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌾</span>
              <span className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
                Farm-Cart
              </span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/auth/login" className="text-gray-600 hover:text-green-700 font-medium transition">Current Farmers</Link>
              <Link href="/shop" className="text-gray-600 hover:text-green-700 font-medium transition">Shop Produce</Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <Link href="/auth/login" className="font-medium text-green-700 hover:text-green-800 transition">Log In</Link>
              <Link 
                href="/auth/register" 
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md shadow-green-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24">
          {/* Background decorative elements */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-green-200 to-emerald-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
              Fresh from the field, <br className="hidden sm:block" />
              <span className="text-green-600">delivered to your door.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Farm-Cart bridges the gap between local farmers and conscious consumers. Experience the taste of truly fresh produce while supporting your local agricultural community.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link 
                href="/auth/register" 
                className="group flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-200 active:scale-95"
              >
                <span>🛒</span> Shop Fresh Produce
              </Link>
              <Link 
                href="/auth/register" 
                className="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-green-700 ring-2 ring-inset ring-green-600 transition-all hover:bg-green-50 active:scale-95"
              >
                <span>👨‍🌾</span> Join as a Farmer
              </Link>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-x-8 text-sm font-medium text-gray-500 sm:mt-20 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> 100% Organic Options</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Support Local Business</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Fast & Fresh Delivery</div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why choose Farm-Cart?</h2>
              <p className="mt-4 text-lg text-gray-600">We&apos;re reimagining the food supply chain to benefit everyone involved.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '🥦', title: 'Peak Freshness', desc: 'Produce is harvested and delivered within 48 hours, ensuring maximum nutrition and taste.' },
                { icon: '🤝', title: 'Fair Trade', desc: 'Farmers set their own prices and keep a much larger share of the profit compared to traditional supermarkets.' },
                { icon: '🌍', title: 'Sustainable', desc: 'Shorter supply chains mean a lower carbon footprint and less food waste from farm to table.' },
              ].map((feature, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center text-3xl mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How it works</h2>
            </div>
            
            <div className="relative">
              {/* Optional connecting line could go here */}
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 relative">
                {[
                  { step: '1', title: 'Browse Local Farms', desc: 'Discover farms in your region and see what they are growing and harvesting this week.' },
                  { step: '2', title: 'Place Your Order', desc: 'Purchase directly from the farmers through our secure platform with no hidden fees.' },
                  { step: '3', title: 'Enjoy Fresh Food', desc: 'Receive your fresh, locally-sourced produce straight to your doorstep or pickup point.' },
                ].map((item, i) => (
                  <div key={i} className="relative text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white shadow-lg mb-6 ring-8 ring-green-50">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 max-w-xs mx-auto">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-700 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready to transform how you eat?</h2>
            <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of others who are enjoying fresher food while supporting local agriculture.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/auth/register" 
                className="rounded-full bg-white text-green-700 px-8 py-3.5 text-lg font-bold hover:bg-green-50 transition shadow-lg"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-800 pb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌾</span>
                <span className="text-xl font-bold">Farm-Cart</span>
              </div>
              <p className="text-gray-400 max-w-sm">Connecting communities through fresh, local, and sustainable agriculture.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/shop" className="hover:text-white transition">Shop Produce</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition">Farmer Login</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Farm-Cart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
