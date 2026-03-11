import { Panel, PanelHeader, Header, Button, Group, Cell, Avatar, Box } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';

export const Home = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();
  const { photo_200, first_name, last_name } = { ...fetchedUser };

  return (
    <Panel id={id}>
      <PanelHeader>CosmoQuiz 🚀</PanelHeader>
      
      {fetchedUser && (
        <Group header={<Header size="s">Привет, исследователь космоса!</Header>}>
          <Cell 
            before={photo_200 && <Avatar src={photo_200} size={48} />}
          >
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header size="s">Выбери действие</Header>}>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button 
            stretched 
            size="l" 
            mode="primary"
            onClick={() => routeNavigator.push('/quiz')}
          >
            Начать игру
          </Button>
          
          <Button 
            stretched 
            size="l" 
            mode="secondary"
            onClick={() => routeNavigator.push('/results')}
            
          >
            Результаты
          </Button>
        </Box>
      </Group>
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
};