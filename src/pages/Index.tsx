
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Settings, Play, Trophy } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Brain size={64} className="text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
            Quiz Master
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in">
            Desafie seus conhecimentos com nosso jogo de perguntas e respostas! 
            Cadastre suas próprias perguntas e teste suas habilidades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-green-500/20 rounded-full w-fit mb-4">
                <Settings size={32} className="text-green-400" />
              </div>
              <CardTitle className="text-white text-xl">Cadastrar Perguntas</CardTitle>
              <CardDescription className="text-white/70">
                Crie suas próprias perguntas personalizadas para o quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link to="/cadastro">
                  Gerenciar Perguntas
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-blue-500/20 rounded-full w-fit mb-4">
                <Play size={32} className="text-blue-400" />
              </div>
              <CardTitle className="text-white text-xl">Jogar Quiz</CardTitle>
              <CardDescription className="text-white/70">
                Inicie o jogo e teste seus conhecimentos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/jogo">
                  Começar Jogo
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-yellow-500/20 rounded-full w-fit mb-4">
                <Trophy size={32} className="text-yellow-400" />
              </div>
              <CardTitle className="text-white text-xl">Resultados</CardTitle>
              <CardDescription className="text-white/70">
                Visualize suas estatísticas e desempenho
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700">
                <Link to="/resultados">
                  Ver Resultados
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Como Jogar</h2>
            <div className="grid md:grid-cols-2 gap-6 text-white/90">
              <div>
                <h3 className="font-semibold mb-2">📝 Cadastre Perguntas</h3>
                <p>Adicione suas próprias perguntas com 4 opções de resposta</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎮 Jogue o Quiz</h3>
                <p>Responda as perguntas sem repetições com barra de progresso</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🆘 Use as Ajudas</h3>
                <p>3 tipos de ajuda: 50/50, Pular e Dica Extra</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📊 Veja Resultados</h3>
                <p>Dashboard completo com estatísticas e feedbacks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
