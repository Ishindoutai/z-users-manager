import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import UserListTable from './components/UserListTable';
import './App.css';

function App() {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
          colorBgContainer: '#ffffff',
        },
      }}
    >
      <div className="app-container">
        <h1 className="app-title">Gerenciamento de Usuários</h1>
        <UserListTable />
      </div>
    </ConfigProvider>
  );
}

export default App;