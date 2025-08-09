import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppearance } from "@/contexts/AppearanceContext";
import { cn } from "@/lib/utils";
import { Settings as SettingsIcon, Home } from "lucide-react";

const Header = () => {
  const { settings } = useAppearance();
  const location = useLocation();
  const headingFontClass = {
    sans: "font-sans",
    playfair: "font-playfair",
    poppins: "font-poppins",
    mono: "font-mono",
  }[settings.headingFont];

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Logo do Quiz configurável"
              className="h-10 w-10 rounded-sm object-contain"
              loading="lazy"
            />
          ) : (
            <div className="h-10 w-10 rounded-sm bg-primary/10 grid place-items-center text-primary">
              <Home className="h-5 w-5" />
            </div>
          )}
          <h1 className={cn("text-xl font-semibold", headingFontClass)}>
            {settings.gameTitle}
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
          {location.pathname !== "/config" && (
            <Button asChild variant="outline">
              <Link to="/config" aria-label="Abrir configurações">
                <SettingsIcon className="mr-2 h-4 w-4" /> Configurações
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
