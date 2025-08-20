import Wallpaper from "@/components/wallpaper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <Wallpaper />
      <div className="w-full z-10 text-center px-4">{children}</div>
    </div>
  );
}
