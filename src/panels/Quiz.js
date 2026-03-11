import { Panel, PanelHeader, PanelHeaderBack, Group, Div, Text } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';

export const Quiz = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}>
        Викторина
      </PanelHeader>
      <Group>
        <Div>
          <Text style={{ textAlign: 'center', fontSize: 18 }}>
            🚀 Скоро здесь появятся вопросы о космосе
          </Text>
        </Div>
      </Group>
    </Panel>
  );
};

Quiz.propTypes = {
  id: PropTypes.string.isRequired,
};