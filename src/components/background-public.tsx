export default function BackgroundPublic({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Professional gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-blue-950"></div>

      {/* Geometric pattern overlay */}
      <div className="fixed inset-0 opacity-25">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid)"
            className="text-primary"
          />
          <rect
            width="100%"
            height="100%"
            fill="url(#dots)"
            className="text-primary"
          />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="fixed top-20 left-10 w-32 h-32 bg-blue-500/25 rounded-full blur-xl animate-pulse"></div>
        <div className="fixed top-40 right-20 w-24 h-24 bg-emerald-500/25 rounded-lg rotate-45 blur-lg animate-pulse delay-1000"></div>
        <div className="fixed bottom-32 left-1/4 w-40 h-40 bg-indigo-500/25 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="fixed bottom-20 right-1/3 w-28 h-28 bg-cyan-500/25 rounded-lg rotate-12 blur-lg animate-pulse delay-3000"></div>
      </div>

      <div className="fixed inset-0 overflow-hidden">
        {/* Large floating spheres */}
        <div className="fixed top-1/4 left-1/6 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="fixed top-1/3 right-1/5 w-48 h-48 bg-gradient-to-br from-emerald-400/15 to-blue-400/10 rounded-full blur-2xl animate-bounce delay-1000"></div>
        <div className="fixed bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-br from-indigo-400/20 to-purple-400/10 rounded-full blur-3xl animate-bounce delay-2000"></div>

        {/* Medium spheres with subtle glow */}
        <div className="fixed top-1/2 left-1/12 w-32 h-32 bg-gradient-to-r from-cyan-300/25 to-blue-300/15 rounded-full blur-xl animate-pulse"></div>
        <div className="fixed top-3/4 right-1/4 w-40 h-40 bg-gradient-to-r from-emerald-300/20 to-teal-300/15 rounded-full blur-xl animate-pulse delay-1500"></div>
        <div className="fixed top-1/6 right-1/12 w-36 h-36 bg-gradient-to-r from-blue-300/25 to-indigo-300/15 rounded-full blur-xl animate-pulse delay-3000"></div>

        {/* Small accent spheres */}
        <div className="fixed top-2/3 left-2/3 w-20 h-20 bg-gradient-to-br from-cyan-400/30 to-blue-400/20 rounded-full blur-lg animate-ping"></div>
        <div className="fixed bottom-1/3 right-2/3 w-24 h-24 bg-gradient-to-br from-emerald-400/25 to-cyan-400/15 rounded-full blur-lg animate-ping delay-2000"></div>
        <div className="fixed top-1/5 left-3/4 w-16 h-16 bg-gradient-to-br from-indigo-400/35 to-blue-400/25 rounded-full blur-md animate-ping delay-1000"></div>
      </div>

      {/* Financial chart lines */}
      <div className="fixed inset-0 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
        >
          <path
            d="M0,400 Q200,300 400,350 T800,250"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-emerald-500"
          />
          <path
            d="M0,450 Q150,380 300,400 T800,320"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-blue-500"
          />
          <path
            d="M0,500 Q250,420 500,450 T800,380"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-cyan-500"
          />
        </svg>
      </div>

      {/* Bottom fade effect */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
      <div className="w-full z-10 px-4">{children}</div>
    </div>
  );
}
