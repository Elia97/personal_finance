export default function BackgroundPrivate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Professional blue gradient background matching home page */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"></div>

      {/* Geometric pattern overlay for depth */}
      <div className="fixed inset-0 opacity-15">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="dashboardGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#dashboardGrid)"
            className="text-blue-300"
          />
        </svg>
      </div>

      {/* Subtle floating elements for depth */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="fixed top-20 right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="fixed bottom-32 left-20 w-32 h-32 bg-indigo-400/8 rounded-full blur-2xl"></div>
        <div className="fixed top-1/2 right-1/4 w-24 h-24 bg-cyan-400/12 rounded-full blur-xl"></div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
