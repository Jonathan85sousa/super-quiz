import { useState } from "react";
import { useAppearance, BackgroundMode, FontOption } from "@/contexts/AppearanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  const H = Math.round(h * 360);
  const S = Math.round(s * 100);
  const L = Math.round(l * 100);
  return `${H} ${S}% ${L}%`;
}

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useAppearance();
  const { toast } = useToast();

  const [gameTitle, setGameTitle] = useState(settings.gameTitle);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>(settings.backgroundMode);
  const [bgHex, setBgHex] = useState("#ffffff");
  const [gradFromHex, setGradFromHex] = useState("#eef2ff");
  const [gradToHex, setGradToHex] = useState("#e2e8f0");
  const [bgImageUrl, setBgImageUrl] = useState(settings.backgroundImageUrl);
  const [bodyFont, setBodyFont] = useState<FontOption>(settings.bodyFont);
  const [headingFont, setHeadingFont] = useState<FontOption>(settings.headingFont);

  const handleSave = () => {
    const patch: any = {
      gameTitle,
      logoUrl,
      backgroundMode,
      backgroundImageUrl: bgImageUrl,
      bodyFont,
      headingFont,
    };
    if (backgroundMode === "color") {
      patch.backgroundColor = hexToHsl(bgHex);
    } else if (backgroundMode === "gradient") {
      patch.gradientFrom = hexToHsl(gradFromHex);
      patch.gradientTo = hexToHsl(gradToHex);
    }

    updateSettings(patch);
    toast({ title: "Configurações salvas", description: "Seu tema foi atualizado." });
  };

  return (
    <main className="container max-w-3xl py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Configurações do Quiz</h1>
        <p className="text-sm text-muted-foreground">Personalize título, logo, background e tipografia.</p>
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identidade</CardTitle>
            <CardDescription>Nome do jogo e logotipo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título do jogo</Label>
              <Input id="title" value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} placeholder="Ex: Meu Super Quiz" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo">URL do logo</Label>
              <Input id="logo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://...logo.png" />
              {logoUrl && (
                <img src={logoUrl} alt="Pré-visualização do logo" className="h-16 w-16 mt-2 object-contain rounded" loading="lazy" />)
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Background</CardTitle>
            <CardDescription>Defina cor sólida, gradiente ou imagem.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Modo</Label>
              <Select value={backgroundMode} onValueChange={(v) => setBackgroundMode(v as BackgroundMode)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Cor sólida</SelectItem>
                  <SelectItem value="gradient">Gradiente</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {backgroundMode === "color" && (
              <div className="grid gap-2">
                <Label>Cor de fundo</Label>
                <Input type="color" value={bgHex} onChange={(e) => setBgHex(e.target.value)} aria-label="Selecionar cor de fundo" />
              </div>
            )}

            {backgroundMode === "gradient" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>De</Label>
                  <Input type="color" value={gradFromHex} onChange={(e) => setGradFromHex(e.target.value)} aria-label="Cor inicial" />
                </div>
                <div className="grid gap-2">
                  <Label>Para</Label>
                  <Input type="color" value={gradToHex} onChange={(e) => setGradToHex(e.target.value)} aria-label="Cor final" />
                </div>
              </div>
            )}

            {backgroundMode === "image" && (
              <div className="grid gap-2">
                <Label htmlFor="bgimg">URL da imagem</Label>
                <Input id="bgimg" value={bgImageUrl} onChange={(e) => setBgImageUrl(e.target.value)} placeholder="https://...fundo.jpg" />
                {bgImageUrl && (
                  <img src={bgImageUrl} alt="Pré-visualização do background" className="mt-2 h-32 w-full object-cover rounded" loading="lazy" />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipografia</CardTitle>
            <CardDescription>Escolha fontes para corpo e títulos.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Fonte do corpo</Label>
              <Select value={bodyFont} onValueChange={(v) => setBodyFont(v as FontOption)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Fonte do corpo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Inter (padrão)</SelectItem>
                  <SelectItem value="playfair">Playfair Display</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                  <SelectItem value="mono">Roboto Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Fonte dos títulos</Label>
              <Select value={headingFont} onValueChange={(v) => setHeadingFont(v as FontOption)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Fonte dos títulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playfair">Playfair Display</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                  <SelectItem value="sans">Inter</SelectItem>
                  <SelectItem value="mono">Roboto Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSave} className="">Salvar</Button>
          <Button variant="outline" onClick={() => { resetSettings(); toast({ title: "Configurações resetadas" }); }}>Resetar</Button>
        </div>
      </div>
    </main>
  );
}
