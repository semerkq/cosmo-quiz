import { useState, useEffect } from 'react';
import { 
  Panel, PanelHeader, PanelHeaderBack, Group, 
  Box, Button, Title, Text, Progress 
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { questions } from '../../utils/questions';
import { saveScore } from '../../utils/storage'; 
import './Quiz.css';

export const Quiz = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  
  // ВСЕ ХУКИ ДОЛЖНЫ БЫТЬ НА ВЕРХНЕМ УРОВНЕ, ПЕРЕД ЛЮБЫМИ УСЛОВИЯМИ!
  const [gameQuestions, setGameQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameFinished, setGameFinished] = useState(false);

  // При загрузке компонента перемешиваем вопросы и берем 10 случайных
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setGameQuestions(shuffled.slice(0, 10));
  }, []);

  // Таймер
  useEffect(() => {
    if (showResult || gameFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSelected(null);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, showResult, gameFinished]);

  // Если вопросы еще не загрузились, показываем загрузку
  // (Это условие находится ПОСЛЕ всех хуков - правильно!)
  if (gameQuestions.length === 0) {
    return (
      <Panel id={id}>
        <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}>
          Загрузка...
        </PanelHeader>
        <Group>
          <Box className="quiz-container">
            <Text>Подготовка вопросов...</Text>
          </Box>
        </Group>
      </Panel>
    );
  }

  const question = gameQuestions[currentIndex];
  const progress = ((currentIndex + 1) / gameQuestions.length) * 100;

  const handleAnswer = (index) => {
    if (showResult) return;
    
    setSelected(index);
    setShowResult(true);
    
    if (index === question.correct) {
      setScore(score + 1);
    }
  };

  const finishGame = async () => {
    await saveScore(score); 
    setGameFinished(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < gameQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setShowResult(false);
      setTimeLeft(15);
    } else {
      finishGame();
    }
  };

  const playAgain = () => {
    // Перемешиваем вопросы заново для новой игры
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setGameQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(15);
    setGameFinished(false);
  };

  const goToResults = () => {
    routeNavigator.push('/results');
  };

  // Финальный экран после завершения игры
  if (gameFinished) {
    const getEmoji = () => {
      if (score === 10) return '🏆';
      if (score >= 8) return '🎯';
      if (score >= 5) return '📊';
      return '📝';
    };

    const getMessage = () => {
      if (score === 10) return "Идеально! Ты космонавт! 🚀";
      if (score >= 8) return "Отлично! Ты знаешь космос! ✨";
      if (score >= 5) return "Хороший результат! ⭐";
      return "Попробуй ещё раз! 🌟";
    };

    return (
      <Panel id={id}>
        <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}>
          Результат
        </PanelHeader>
        <Group>
          <Box className="quiz-final-container">
            <Box className="quiz-final-card">
              <Text className="quiz-final-emoji">
                {getEmoji()}
              </Text>
              <Title level="2" className="quiz-final-score">
                {score}/{gameQuestions.length}
              </Title>
              <Text className="quiz-final-message">
                {getMessage()}
              </Text>
              <Box style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <Button 
                  size="l" 
                  mode="primary"
                  onClick={playAgain}
                  className="quiz-final-button"
                >
                  Сыграть ещё
                </Button>
                <Button 
                  size="l" 
                  mode="secondary"
                  onClick={goToResults}
                  className="quiz-final-button"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  К результатам
                </Button>
              </Box>
            </Box>
          </Box>
        </Group>
      </Panel>
    );
  }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}>
        Вопрос {currentIndex + 1}/{gameQuestions.length}
      </PanelHeader>

      <Group>
        <Box className="quiz-container">
          <Progress 
            value={progress} 
            className="quiz-progress"
          />
          
          <Box className={`quiz-timer ${timeLeft < 5 ? 'quiz-timer-danger' : 'quiz-timer-safe'}`}>
            <Text className="quiz-timer-text">
              ⏱ {timeLeft} сек
            </Text>
          </Box>

          <Title level="2" className="quiz-question">
            <span className="question-with-stars">
              {question.question}
            </span>
            <Box className="star-one">✨</Box>
            <Box className="star-two">✨</Box>
            <Box className="star-three">✨</Box>
            <Box className="star-four">✨</Box>
          </Title>

          <Box className="quiz-answers">
            {question.options.map((option, index) => {
              let isCorrect = showResult && index === question.correct;
              let isWrong = showResult && index === selected && index !== question.correct;
              
              return (
                <Button
                  key={index}
                  mode={isWrong ? 'destructive' : 'secondary'}
                  size="l"
                  stretched
                  disabled={showResult}
                  onClick={() => handleAnswer(index)}
                  className={`quiz-answer-button ${isCorrect ? 'quiz-answer-correct' : ''}`}
                >
                  {option}
                </Button>
              );
            })}
          </Box>

          {showResult && (
            <Box className="quiz-fact">
              <Text className="quiz-fact-title">
                ✨ Знаешь ли ты?
              </Text>
              <Text className="quiz-fact-text">
                {question.fact}
              </Text>
            </Box>
          )}

          {showResult && (
            <Button 
              size="l" 
              stretched 
              mode="primary"
              onClick={nextQuestion}
              className="quiz-next-button"
            >
              {currentIndex + 1 < gameQuestions.length ? 'Следующий вопрос →' : 'Завершить'}
            </Button>
          )}
        </Box>
      </Group>
    </Panel>
  );
};

Quiz.propTypes = {
  id: PropTypes.string.isRequired,
};