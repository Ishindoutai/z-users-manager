import React, { useState, useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import { Input, Tag, message, Popconfirm, Button } from 'antd';

export default function UserListTable() {
  const [userList, setUserList] = useState([]);
  const [editableKeys, setEditableKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os usuários
  async function getUserList() {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5001/z-users-manager/us-central1/getUserList");
      
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      
      const data = await response.json();
      
      // Transforma a estrutura dos dados para o formato esperado pela tabela
      const formattedUsers = data.users.map(user => ({
        id: user.id,
        email: user.data.email,
        permissions: user.data.permissions || [],
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt
      }));
      
      setUserList(formattedUsers);
    } catch (error) {
      console.error('Error fetching user list:', error);
      message.error('Falha ao carregar lista de usuários');
    } finally {
      setLoading(false);
    }
  }

  // Função para atualizar usuário no backend
  async function updateUser(userId, userData) {
    try {
      const response = await fetch(
        `http://127.0.0.1:5001/z-users-manager/us-central1/updateUserById?userId=${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            permissions: userData.permissions
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Função para deletar usuário no backend
  async function deleteUserById(userId) {
    try {
      const response = await fetch(
        `http://127.0.0.1:5001/z-users-manager/us-central1/deleteUserById?userId=${userId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao deletar usuário');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  // Colunas da tabela
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      editable: false,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      formItemProps: {
        rules: [
          { required: true, message: 'Email é obrigatório' },
          { type: 'email', message: 'Por favor, insira um email válido' },
        ],
      },
      renderFormItem: (_, { record }) => (
        <Input placeholder="Digite o email" />
      ),
    },
    {
      title: 'Permissões',
      dataIndex: 'permissions',
      key: 'permissions',
      valueType: 'tags',
      render: (_, record) => (
        <>
          {record.permissions?.map((permission) => (
            <Tag key={permission}>{permission}</Tag>
          ))}
        </>
      ),
      renderFormItem: (_, { record, value, onChange }) => (
        <Input
          placeholder="Digite as permissões separadas por vírgula"
          value={value?.join(',')}
          onChange={(e) => {
            const newPermissions = e.target.value
              .split(',')
              .map(item => item.trim())
              .filter(item => item);
            onChange(newPermissions);
          }}
        />
      ),
    },
    {
      title: 'Criado em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'date',
      editable: false,
    },
    {
      title: 'Atualizado em',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      valueType: 'date',
      editable: false,
    },
    {
      title: 'Ações',
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button
          type="default"
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Editar
        </Button>,
      ],
    },
  ];

  // Configurações de edição
  const editableConfig = {
    type: 'single',
    editableKeys,
    onChange: setEditableKeys,
    onSave: async (key, row, originRow, newLine) => {
      try {
        setLoading(true);
        
        // Atualiza o state local primeiro para uma resposta mais rápida
        setUserList(prev => prev.map(user => 
          user.id === key ? { ...user, ...row, updatedAt: new Date().toISOString() } : user
        ));
        
        // Envia a requisição para o backend
        await updateUser(key, row);
        
        message.success('Usuário atualizado com sucesso');
      } catch (error) {
        // Reverte as alterações locais em caso de erro
        setUserList(prev => prev.map(user => 
          user.id === key ? originRow : user
        ));
        message.error('Falha ao atualizar usuário');
      } finally {
        setLoading(false);
      }
    },
    onDelete: async (key, row) => {
      try {
        setLoading(true);
        // Chama a função para deletar o usuário no backend
        await deleteUserById(key);
        
        // Atualiza o state local
        setUserList(prev => prev.filter(user => user.id !== key));
        
        message.success('Usuário removido com sucesso');
      } catch (error) {
        message.error('Falha ao remover usuário');
      } finally {
        setLoading(false);
      }
    },
    actionRender: (row, config, defaultDom) => [
      <Button key="save" type="primary">
        Salvar
      </Button>,
      <Button key="cancel" style={{ marginLeft: 8 }}>
        Cancelar
      </Button>,
      <Popconfirm
        key="delete"
        title="Tem certeza que deseja excluir este usuário?"
        onConfirm={() => config.onDelete(row.id, row)}
        okText="Sim"
        cancelText="Não"
      >
        <Button danger style={{ marginLeft: 8 }}>
          Excluir
        </Button>
      </Popconfirm>,
    ],
  };

  return (
    <div style={{ padding: 24 }}>
      <EditableProTable
        columns={columns}
        rowKey="id"
        value={userList}
        loading={loading}
        search={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Total de ${total} usuários`,
        }}
        recordCreatorProps={false}
        editable={editableConfig}
        onChange={setUserList}
        locale={{
          filterConfirm: 'OK',
          filterReset: 'Resetar',
          emptyText: 'Nenhum usuário encontrado',
          editableTable: {
            action: {
              save: 'Salvar',
              cancel: 'Cancelar',
              delete: 'Excluir',
              add: 'Adicionar',
            },
          },
        }}
        options={{
          reload: () => getUserList(),
          setting: false,
          density: false,
        }}
        headerTitle="Lista de Usuários"
      />
    </div>
  );
}