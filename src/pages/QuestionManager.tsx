
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, Plus, Trash2, Home, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QuestionManager = () => {
  const { questions, addQuestion, removeQuestion } = useQuiz();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    hint: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim()) {
      toast({ title: "Erro", description: "Digite a pergunta", variant: "destructive" });
      return;
    }

    if (formData.options.some(option => !option.trim())) {
      toast({ title: "Erro", description: "Preencha todas as opções", variant: "destructive" });
      return;
    }

    if (!formData.category.trim()) {
      toast({ title: "Erro", description: "Digite a categoria", variant: "destructive" });
      return;
    }

    addQuestion(formData);
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      category: '',
      difficulty: 'medium',
      hint: '',
    });
    setIsAdding(false);
    toast({ title: "Sucesso!", description: "Pergunta adicionada com sucesso!" });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gerenciar Perguntas</h1>
            <p className="text-white/80">Cadastre suas perguntas personalizadas para o quiz</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Link to="/">
                <Home size={20} className="mr-2" />
                Início
              </Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/jogo">
                <Play size={20} className="mr-2" />
                Jogar Agora
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus size={24} className="mr-2" />
                {isAdding ? 'Nova Pergunta' : 'Adicionar Pergunta'}
              </CardTitle>
              <CardDescription className="text-white/70">
                Preencha os campos para criar uma nova pergunta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isAdding ? (
                <Button onClick={() => setIsAdding(true)} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus size={20} className="mr-2" />
                  Criar Nova Pergunta
                </Button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="question" className="text-white">Pergunta</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="Digite sua pergunta aqui..."
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-white">Categoria</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Ex: História, Ciências..."
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty" className="text-white">Dificuldade</Label>
                      <Select value={formData.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setFormData({ ...formData, difficulty: value })}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Fácil</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="hard">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Opções de Resposta</Label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={formData.correctAnswer === index}
                            onChange={() => setFormData({ ...formData, correctAnswer: index })}
                            className="mr-2"
                          />
                          <span className="text-white text-sm">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Opção ${String.fromCharCode(65 + index)}`}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="hint" className="text-white">Dica (Opcional)</Label>
                    <Textarea
                      id="hint"
                      value={formData.hint}
                      onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                      placeholder="Digite uma dica que ajude na resposta..."
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      Salvar Pergunta
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Lista de Perguntas */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Perguntas Cadastradas ({questions.length})</CardTitle>
              <CardDescription className="text-white/70">
                Gerencie suas perguntas existentes
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/70">Nenhuma pergunta cadastrada ainda.</p>
                  <p className="text-white/50 text-sm mt-2">Comece criando sua primeira pergunta!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{index + 1}. {question.question}</h3>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 bg-blue-500/30 text-blue-200 text-xs rounded">
                              {question.category}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              question.difficulty === 'easy' ? 'bg-green-500/30 text-green-200' :
                              question.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                              'bg-red-500/30 text-red-200'
                            }`}>
                              {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <div className="text-sm text-white/80">
                        <p><strong>Resposta:</strong> {String.fromCharCode(65 + question.correctAnswer)} - {question.options[question.correctAnswer]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;
