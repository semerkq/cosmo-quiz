import { useState, useEffect } from 'react';
import { View, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';

import { Home, Quiz, Results } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();

  useEffect(() => {
    bridge.send('VKWebAppInit');
    
    bridge.send('VKWebAppGetUserInfo')
      .then(setUser)
      .catch(error => console.log('Не удалось получить пользователя:', error));
  }, []);

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home id="home" fetchedUser={fetchedUser} />
          <Quiz id="quiz" />
          <Results id="results" />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};