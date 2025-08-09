
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Clock, 
  Target, 
  Brain, 
  Home, 
  Play, 
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const ResultsPage = () => {
  const { gameState, resetGame } = useQuiz();

  if (!gameState.isGameFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Nenhum jogo concluído</CardTitle>
            <CardDescription className="text-white/70">
              Complete um jogo para ver seus resultados
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/jogo">
                <Play size={20} className="mr-2" />
                Jogar Agora
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalQuestions = gameState.questions.length;
  const correctAnswers = gameState.answers.filter(a => a.isCorrect).length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const totalTime = gameState.endTime && gameState.startTime 
    ? Math.floor((gameState.endTime.getTime() - gameState.startTime.getTime()) / 1000)
    : 0;
  const averageTime = gameState.answers.length > 0 
    ? gameState.answers.reduce((sum, a) => sum + a.timeSpent, 0) / gameState.answers.length 
    : 0;

  const getPerformanceLevel = () => {
    if (accuracy >= 90) return { level: 'Excelente', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (accuracy >= 70) return { level: 'Bom', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    if (accuracy >= 50) return { level: 'Regular', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { level: 'Precisa Melhorar', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  };

  const performance = getPerformanceLevel();

  const getFeedback = () => {
    if (accuracy >= 90) return "🎉 Incrível! Você domina o assunto!";
    if (accuracy >= 70) return "👏 Muito bem! Continue assim!";
    if (accuracy >= 50) return "📚 Bom trabalho! Continue estudando!";
    return "💪 Não desista! A prática leva à perfeição!";
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Trophy size={64} className="text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Resultados do Quiz</h1>
          <p className="text-white/80 text-lg">{getFeedback()}</p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center pb-2">
              <Trophy className="mx-auto text-yellow-400 mb-2" size={32} />
              <CardTitle className="text-white text-lg">Pontuação</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">{gameState.score}</div>
              <div className="text-white/70 text-sm">pontos</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center pb-2">
              <Target className="mx-auto text-green-400 mb-2" size={32} />
              <CardTitle className="text-white text-lg">Precisão</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">{accuracy.toFixed(1)}%</div>
              <div className="text-white/70 text-sm">{correctAnswers}/{totalQuestions} corretas</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center pb-2">
              <Clock className="mx-auto text-blue-400 mb-2" size={32} />
              <CardTitle className="text-white text-lg">Tempo Total</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</div>
              <div className="text-white/70 text-sm">minutos</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center pb-2">
              <TrendingUp className="mx-auto text-purple-400 mb-2" size={32} />
              <CardTitle className="text-white text-lg">Tempo Médio</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">{averageTime.toFixed(1)}s</div>
              <div className="text-white/70 text-sm">por pergunta</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Performance Analysis */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain size={24} className="mr-2" />
                Análise de Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`p-4 rounded-lg ${performance.bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Nível de Performance</span>
                  <Badge className={`${performance.color} bg-transparent border-current`}>
                    {performance.level}
                  </Badge>
                </div>
                <Progress value={accuracy} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/20 p-4 rounded-lg text-center">
                  <CheckCircle className="mx-auto text-green-400 mb-2" size={32} />
                  <div className="text-2xl font-bold text-white">{correctAnswers}</div>
                  <div className="text-green-200 text-sm">Acertos</div>
                </div>
                <div className="bg-red-500/20 p-4 rounded-lg text-center">
                  <XCircle className="mx-auto text-red-400 mb-2" size={32} />
                  <div className="text-2xl font-bold text-white">{totalQuestions - correctAnswers}</div>
                  <div className="text-red-200 text-sm">Erros</div>
                </div>
              </div>

              {/* Help Usage */}
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-3">Ajudas Utilizadas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80">
                    <span>50/50:</span>
                    <span>{gameState.helps.fiftyFifty ? 'Não usada' : 'Usada'}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Pular:</span>
                    <span>{gameState.helps.skip ? 'Não usada' : 'Usada'}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Dica:</span>
                    <span>{gameState.helps.hint ? 'Não usada' : 'Usada'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star size={24} className="mr-2" />
                Resumo Detalhado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {gameState.answers.map((answer, index) => {
                  const question = gameState.questions.find(q => q.id === answer.questionId);
                  if (!question) return null;

                  return (
                    <div key={answer.questionId} className="bg-white/10 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm mb-1">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs text-white/70 border-white/30">
                              {question.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs text-white/70 border-white/30">
                              {answer.timeSpent}s
                            </Badge>
                            {answer.helpUsed && (
                              <Badge variant="outline" className="text-xs text-blue-200 border-blue-300">
                                {answer.helpUsed}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {answer.selectedAnswer === -2 ? (
                            <ArrowRight className="text-blue-400" size={20} />
                          ) : answer.isCorrect ? (
                            <CheckCircle className="text-green-400" size={20} />
                          ) : (
                            <XCircle className="text-red-400" size={20} />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-white/80">
                        {answer.selectedAnswer === -2 ? (
                          <span className="text-blue-200">Pergunta pulada</span>
                        ) : answer.selectedAnswer === -1 ? (
                          <span className="text-red-200">Tempo esgotado</span>
                        ) : (
                          <>
                            <span>Sua resposta: {String.fromCharCode(65 + answer.selectedAnswer)}</span>
                            {!answer.isCorrect && (
                              <span className="block text-green-200">
                                Correta: {String.fromCharCode(65 + question.correctAnswer)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button 
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700"
            asChild
          >
            <Link to="/jogo">
              <Play size={20} className="mr-2" />
              Jogar Novamente
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <Link to="/cadastro">
              Gerenciar Perguntas
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <Link to="/">
              <Home size={20} className="mr-2" />
              Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
