export default function Footer() {
  return (
    <footer className="bg-slate-900">
      {/* Stats Section */}
      <div className="bg-slate-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Real-time events, delivered reliably
              </h2>

              <p className="text-slate-300 text-lg mb-8 max-w-lg">
                GopherNet enables systems, platforms, and applications to
                publish and consume events in real time. Built for scale,
                low latency, and high availability.
              </p>
              
              <div className="flex gap-12">
                <div>
                  <div className="text-5xl font-bold text-cyan-400 mb-2">10K+</div>
                  <div className="text-sm text-slate-400">Events / minute</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-cyan-400 mb-2">99.9%</div>
                  <div className="text-sm text-slate-400">Delivery uptime</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-cyan-400 mb-2">&lt;50ms</div>
                  <div className="text-sm text-slate-400">Average latency</div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Start using GopherNet
              </h3>
              <p className="text-slate-600 mb-6">
                Deploy the broker, publish events, and connect subscribers
                in minutes. No complex setup required.
              </p>
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
                Get Started →
              </button>
              <p className="text-center text-sm text-slate-600">
                Need help?{" "}
                <a href="#" className="text-cyan-500 hover:underline">
                  Contact Support
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
