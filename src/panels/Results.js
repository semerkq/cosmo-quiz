import { Panel, PanelHeader, PanelHeaderBack, Group, Div, Text } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';

export const Results = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}>
        Результаты
      </PanelHeader>
      <Group>
        <Div>
          <Text style={{ textAlign: 'center', fontSize: 18 }}>
            📊 Здесь будет твоя статистика
          </Text>
        </Div>
      </Group>
    </Panel>
  );
};

Results.propTypes = {
  id: PropTypes.string.isRequired,
};