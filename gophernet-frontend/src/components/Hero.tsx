interface Event {
  topic: string;
  message: string;
  timestamp: Date;
}

interface HeroProps {
  event?: Event;
}

export default function Hero({ event }: HeroProps) {
  if (!event) return null;

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-6 max-w-xl">
            <h1 className="text-5xl font-bold leading-tight text-slate-900">
              {event.topic}
              <br />
              <span className="text-cyan-700">
                Event Automation
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              GopherNet delivers distributed, real-time
              notifications with reliability and precision.
            </p>

            <div className="flex gap-4 pt-2">
              {/* <button className="px-6 py-3 bg-gradient-to-r from-cyan-700 to-blue-700 text-white text-sm font-semibold rounded-md hover:opacity-90"> */}
              <button
                className="
                    px-8 py-3
                    bg-[#051321]
                    text-white text-sm font-semibold
                    rounded-full
                    hover:opacity-80
                  ">
                Get Started
              </button>

              <button className="px-6 py-3 text-sm font-medium text-slate-700 hover:text-slate-900">
                View Demo
              </button>
            </div>


            {/* <p className="text-xs font-mono text-slate-500">
              {new Date(event.timestamp).toLocaleString()}
            </p> */}
          </div>

          {/* RIGHT TERMINAL */}
          <TerminalCard />

        </div>
      </div>
    </section>
  );
}

function TerminalCard() {
  const commands = `git clone https://github.com/yourname/gophernet
cd gophernet-backend
go run main.go
curl -X POST http://localhost:3000/publish`;

  const handleCopy = () => {
    navigator.clipboard.writeText(commands);
  };

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0">
      <div className="bg-slate-900 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
          <span className="text-green-400 text-sm font-mono">gophernet@backend:~</span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-1000"
          // title="Copy commands"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 25 25">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 font-mono text-sm text-slate-200 space-y-2">
          <p><span className="text-cyan-400">$</span> git clone https://github.com/yourname/gophernet</p>
          <p><span className="text-cyan-400">$</span> cd gophernet-backend</p>
          <p><span className="text-cyan-400">$</span> go run main.go</p>
          <p><span className="text-cyan-400">$</span> curl -X POST http://localhost:3000/publish</p>
          <p className="pt-2 text-green-400">
            ✓ GopherNet Backend running on :3000
          </p>
        </div>

      </div>
    </div>
  );
}
