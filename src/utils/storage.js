import bridge from '@vkontakte/vk-bridge';

const STORAGE_KEY = 'cosmo_quiz';

export const getUser = async () => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    return user;
  } catch (e) {
    console.error('Ошибка получения пользователя:', e);
    return null;
  }
};

export const saveScore = async (score) => {
  try {    
    const data = await bridge.send('VKWebAppStorageGet', { keys: [STORAGE_KEY] });
    
    let records = {};
    
    if (data.keys[0] && data.keys[0].value) {
      records = JSON.parse(data.keys[0].value);
    }
    
    const history = records.history || [];
    const newEntry = {
      score: score,
      date: new Date().toLocaleDateString('ru-RU'),
      timestamp: Date.now()
    };
    
    history.unshift(newEntry); 
    if (history.length > 10) history.pop(); 
    
    const gamesCount = (records.gamesCount || 0) + 1;
    
    if (!records.best || score > records.best) {
      records.best = score;
    }
    
    records.last = score;
    records.lastDate = new Date().toISOString();
    records.gamesCount = gamesCount;
    records.history = history;
    
    await bridge.send('VKWebAppStorageSet', {
      key: STORAGE_KEY,
      value: JSON.stringify(records)
    });
    return records;
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    return null;
  }
};

export const loadScores = async () => {
  try {
    const data = await bridge.send('VKWebAppStorageGet', { keys: [STORAGE_KEY] });
    
    if (data.keys[0] && data.keys[0].value) {
      return JSON.parse(data.keys[0].value);
    }
    return { best: 0, last: 0, gamesCount: 0, history: [] };
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return { best: 0, last: 0, gamesCount: 0, history: [] };
  }
};