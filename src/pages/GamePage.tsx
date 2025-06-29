
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Play, 
  Lightbulb, 
  ArrowUp, 
  Clock, 
  Heart,
  Trophy,
  AlertCircle 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const GamePage = () => {
  const navigate = useNavigate();
  const { 
    gameState, 
    questions, 
    startGame, 
    answerQuestion, 
    useHelp, 
    nextQuestion,
    finishGame 
  } = useQuiz();
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

  // Timer effect
  useEffect(() => {
    if (!gameState.isGameActive || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameActive, showResult, gameState.currentQuestionIndex]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
    setQuestionStartTime(Date.now());
    setSelectedAnswer(null);
    setShowResult(false);
    setEliminatedOptions([]);
  }, [gameState.currentQuestionIndex]);

  // Check if game should finish
  useEffect(() => {
    if (gameState.isGameFinished) {
      navigate('/resultados');
    }
  }, [gameState.isGameFinished, navigate]);

  const handleTimeUp = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    answerQuestion(-1, timeSpent); // -1 indicates no answer
    setShowResult(true);
    
    setTimeout(() => {
      if (gameState.currentQuestionIndex + 1 >= gameState.questions.length || gameState.lives <= 1) {
        finishGame();
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const handleStartGame = () => {
    if (questions.length === 0) {
      toast({
        title: "Nenhuma pergunta encontrada",
        description: "Cadastre algumas perguntas antes de jogar!",
        variant: "destructive"
      });
      return;
    }

    const selectedQuestions = questions.length > 10 ? 
      questions.sort(() => Math.random() - 0.5).slice(0, 10) : 
      questions;
    
    startGame(selectedQuestions);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    answerQuestion(answerIndex, timeSpent);
    setShowResult(true);

    setTimeout(() => {
      if (gameState.currentQuestionIndex + 1 >= gameState.questions.length || 
          (answerIndex !== currentQuestion.correctAnswer && gameState.lives <= 1)) {
        finishGame();
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const handleUseHelp = (helpType: 'fiftyFifty' | 'skip' | 'hint') => {
    if (!gameState.helps[helpType]) return;

    useHelp(helpType);
    
    switch (helpType) {
      case 'fiftyFifty':
        const correctAnswer = currentQuestion.correctAnswer;
        const wrongOptions = [0, 1, 2, 3].filter(i => i !== correctAnswer);
        const optionsToEliminate = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        setEliminatedOptions(optionsToEliminate);
        toast({ title: "50/50 Usado!", description: "Duas opções incorretas foram eliminadas." });
        break;
        
      case 'skip':
        toast({ title: "Pergunta Pulada!", description: "Passando para a próxima pergunta." });
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
        answerQuestion(-2, timeSpent, 'skip'); // -2 indicates skipped
        setTimeout(() => {
          if (gameState.currentQuestionIndex + 1 >= gameState.questions.length) {
            finishGame();
          } else {
            nextQuestion();
          }
        }, 1000);
        break;
        
      case 'hint':
        toast({ 
          title: "Dica!", 
          description: currentQuestion.hint || "Esta pergunta não possui dica específica. Analise as opções cuidadosamente!",
          duration: 5000
        });
        break;
    }
  };

  if (!gameState.isGameActive && gameState.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 bg-blue-500/20 rounded-full w-fit mb-4">
              <Play size={48} className="text-blue-400" />
            </div>
            <CardTitle className="text-white text-2xl">Iniciar Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-white/80">
              <p className="mb-4">
                {questions.length === 0 
                  ? "Você precisa cadastrar algumas perguntas antes de jogar!"
                  : `${questions.length} pergunta${questions.length > 1 ? 's' : ''} disponível${questions.length > 1 ? 'eis' : ''}`
                }
              </p>
              
              {questions.length > 0 && (
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2">Regras do Jogo:</h3>
                  <ul className="text-sm space-y-1 text-left">
                    <li>• 30 segundos por pergunta</li>
                    <li>• 3 vidas (chances de erro)</li>
                    <li>• 3 tipos de ajuda disponíveis</li>
                    <li>• Perguntas não se repetem</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Link to="/cadastro">
                  Cadastrar Perguntas
                </Link>
              </Button>
              
              {questions.length > 0 && (
                <Button onClick={handleStartGame} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Play size={20} className="mr-2" />
                  Começar
                </Button>
              )}
            </div>
            
            <Button asChild variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/10">
              <Link to="/">
                <Home size={20} className="mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameState.isGameActive || gameState.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando jogo...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const progress = ((gameState.currentQuestionIndex + 1) / gameState.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Pergunta {gameState.currentQuestionIndex + 1} de {gameState.questions.length}
            </Badge>
            <div className="flex items-center gap-2 text-white">
              <Heart size={20} className="text-red-400" />
              <span>{gameState.lives}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Trophy size={20} className="text-yellow-400" />
              <span>{gameState.score}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <Clock size={20} />
            <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3 bg-white/20" />
        </div>

        {/* Help Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => handleUseHelp('fiftyFifty')}
            disabled={!gameState.helps.fiftyFifty || showResult}
            variant={gameState.helps.fiftyFifty ? "default" : "secondary"}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600"
          >
            50/50
          </Button>
          
          <Button
            onClick={() => handleUseHelp('skip')}
            disabled={!gameState.helps.skip || showResult}
            variant={gameState.helps.skip ? "default" : "secondary"}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
          >
            <ArrowUp size={20} className="mr-1" />
            Pular
          </Button>
          
          <Button
            onClick={() => handleUseHelp('hint')}
            disabled={!gameState.helps.hint || showResult}
            variant={gameState.helps.hint ? "default" : "secondary"}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
          >
            <Lightbulb size={20} className="mr-1" />
            Dica
          </Button>
        </div>

        {/* Question Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge className="bg-blue-500/30 text-blue-200">
                {currentQuestion.category}
              </Badge>
              <Badge className={`${
                currentQuestion.difficulty === 'easy' ? 'bg-green-500/30 text-green-200' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                'bg-red-500/30 text-red-200'
              }`}>
                {currentQuestion.difficulty === 'easy' ? 'Fácil' : 
                 currentQuestion.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </Badge>
            </div>
            <CardTitle className="text-white text-2xl text-center py-4">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult || eliminatedOptions.includes(index)}
                  className={`p-6 h-auto text-left justify-start transition-all duration-300 ${
                    eliminatedOptions.includes(index) 
                      ? 'bg-gray-600 opacity-50 cursor-not-allowed' 
                      : showResult
                        ? index === currentQuestion.correctAnswer
                          ? 'bg-green-600 hover:bg-green-600'
                          : selectedAnswer === index
                            ? 'bg-red-600 hover:bg-red-600'
                            : 'bg-white/20 hover:bg-white/20'
                        : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-bold mr-3 text-lg">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={eliminatedOptions.includes(index) ? 'line-through' : ''}>
                      {option}
                    </span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <span className="ml-auto text-green-200">✓</span>
                    )}
                    {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <span className="ml-auto text-red-200">✗</span>
                    )}
                  </div>
                </Button>
              ))}
            </div>
            
            {showResult && (
              <div className="mt-6 text-center">
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === currentQuestion.correctAnswer || selectedAnswer === -2
                    ? 'bg-green-500/20 text-green-200' 
                    : 'bg-red-500/20 text-red-200'
                }`}>
                  {selectedAnswer === -2 ? (
                    <p>Pergunta pulada!</p>
                  ) : selectedAnswer === currentQuestion.correctAnswer ? (
                    <p>🎉 Resposta correta! +100 pontos</p>
                  ) : selectedAnswer === -1 ? (
                    <p>⏰ Tempo esgotado! A resposta correta era: {String.fromCharCode(65 + currentQuestion.correctAnswer)}</p>
                  ) : (
                    <p>❌ Resposta incorreta! A resposta correta era: {String.fromCharCode(65 + currentQuestion.correctAnswer)}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamePage;
