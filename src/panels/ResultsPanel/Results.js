import { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, Title, Text } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { loadScores } from '../../utils/storage'; 
import './Results.css';

export const Results = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const [scores, setScores] = useState({ best: 0, last: 0, gamesCount: 0, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadScores();
      setScores(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const getEmoji = () => {
    if (scores.best === 10) return '🏆';
    if (scores.best >= 8) return '🌠';
    if (scores.best >= 5) return '🚀';
    return '🌍';
  };

  const getMessage = () => {
    if (scores.best === 10) return 'Ты покорил космос! 🌟';
    if (scores.best >= 8) return 'Настоящий космонавт! ✨';
    if (scores.best >= 5) return 'Хороший старт! 🚀';
    return 'Космос ждет героев! 💫';
  };

  if (loading) {
    return (
      <Panel id={id} className="results-container">
        <div className="nebula"></div>
        <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}>
          Результаты
        </PanelHeader>
        <div className="results-content">
          <div className="results-card">
            <Text>Загрузка...</Text>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel id={id} className="results-container">
      <div className="nebula"></div>
      
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}>
        Результаты
      </PanelHeader>
      
      <div className="results-content">
        <div className="results-card">
          <Title level="2" className="results-title">
            Твои достижения
          </Title>
          
          <div className="results-emoji-container">
            {getEmoji()}
          </div>
          
          <div className="results-score">
            {scores.last}<span className="total">/10</span>
          </div>
          
          <Text className="results-message">
            {getMessage()}
          </Text>
          
          <div className="results-stats">
            <div className="stat-item">
              <div className="stat-label">Рекорд</div>
              <div className="stat-value">
                {scores.best}<span className="stat-unit">/10</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Всего игр</div>
              <div className="stat-value">
                {scores.gamesCount}<span className="stat-unit"></span>
              </div>
            </div>
          </div>

          {scores.history && scores.history.length > 0 && (
            <div className="results-history">
              <Title level="3" className="history-title">
                Последние игры
              </Title>
              <div className="history-list">
                {scores.history.map((item, index) => (
                  <div key={index} className="history-item">
                    <span className="history-score">{item.score}/10</span>
                    <span className="history-date">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="results-buttons-container">
            <div className="results-buttons">
              <Button 
                size="l" 
                mode="primary"
                onClick={() => routeNavigator.push('/quiz')}
                className="results-button-primary"
              >
                🚀 Новая игра
              </Button>
              
              <Button 
                size="l" 
                mode="secondary"
                onClick={() => routeNavigator.push('/')}
                className="results-button-secondary"
              >
                На главную
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

Results.propTypes = {
  id: PropTypes.string.isRequired,
};