import { Panel, PanelHeader, Header, Button, Group, Cell, Avatar, Box } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import './Home.css';

export const Home = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();
  const { photo_200, first_name, last_name } = { ...fetchedUser };

  return (
    <Panel id={id} className="home-container">
      <div className="nebula"></div>
      <div className="planet"></div>
      
      <PanelHeader>CosmoQuiz🚀</PanelHeader>
      
      <div className="home-content">
        {fetchedUser && (
          <Group header={<Header size="s" className="home-header">Привет, исследователь космоса!</Header>}>
            <Cell 
              before={photo_200 && <Avatar src={photo_200} size={48} className="home-avatar" />}
            >
              <span className="home-user-name">{`${first_name} ${last_name}`}</span>
            </Cell>
          </Group>
        )}

        <Group header={<Header size="s" className="home-header">Выбери действие</Header>}>
          <Box className="home-buttons">
            <Button 
              stretched 
              size="l" 
              mode="primary"
              onClick={() => routeNavigator.push('/quiz')}
              className="home-button-primary"
            >
              Начать игру
            </Button>
            
            <Button 
              stretched 
              size="l" 
              mode="secondary"
              onClick={() => routeNavigator.push('/results')}
              className="home-button-secondary"
            >
              Результаты
            </Button>
          </Box>
        </Group>
      </div>
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