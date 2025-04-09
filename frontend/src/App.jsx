import React from 'react';
import { Layout, App as AntApp } from 'antd';
import { Routes, Route } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import MainLayout from './components/Layout/MainLayout';
import './App.css';

const { Content } = Layout;

const App = () => {
  return (
    <AntApp>
      <MainLayout>
        <Content style={{ padding: '24px', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<UsersPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </Content>
      </MainLayout>
    </AntApp>
  );
};

export default App;