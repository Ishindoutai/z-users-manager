import React, { useState, useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import { Input, Tag, message, Popconfirm, Button, Form, Modal } from 'antd';

export default function UserListTable() {
  const [userList, setUserList] = useState([]);
  const [editableKeys, setEditableKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempData, setTempData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Função para criar novo usuário
  async function createUser(userData) {
    try {
      setLoading(true);
      const response = await fetch(
        "http://127.0.0.1:5001/z-users-manager/us-central1/createUser",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            permissions: userData.permissions || []
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao criar usuário');
      }

      const data = await response.json();
      message.success('Usuário criado com sucesso');
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Falha ao criar usuário');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Função para lidar com a criação de novo usuário
  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      const newUser = await createUser({
        email: values.email,
        password: values.password,
        permissions: values.permissions ? values.permissions.split(',').map(p => p.trim()) : []
      });

      // Atualiza a lista de usuários
      setUserList(prev => [
        ...prev,
        {
          id: newUser.userId,
          email: newUser.email,
          permissions: newUser.permissions || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Adicionar ao JSX o botão e modal de criação
  const renderCreateButton = () => (
    <Button 
      type="primary" 
      onClick={() => setIsModalVisible(true)}
      style={{ marginBottom: 16 }}
    >
      Adicionar Usuário
    </Button>
  );

  // Modal de criação de usuário
  const renderCreateModal = () => (
    <Modal
      title="Adicionar Novo Usuário"
      open={isModalVisible}
      onOk={handleCreateUser}
      onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Por favor, insira o email' },
            { type: 'email', message: 'Por favor, insira um email válido' }
          ]}
        >
          <Input placeholder="exemplo@email.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Senha"
          rules={[
            { required: true, message: 'Por favor, insira a senha' },
            { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' }
          ]}
        >
          <Input.Password placeholder="Digite a senha" />
        </Form.Item>
        <Form.Item
          name="permissions"
          label="Permissões (separadas por vírgula)"
        >
          <Input placeholder="admin, editor, viewer" />
        </Form.Item>
      </Form>
    </Modal>
  );

  // Função para buscar os usuários
  async function getUserList() {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5001/z-users-manager/us-central1/getUserList");
      
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      
      const data = await response.json();
      
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
            setTempData(record); // Salva os dados atuais antes de editar
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
    onSave: async (key, row) => {
      try {
        setLoading(true);
        // Envia a requisição para o backend primeiro
        await updateUser(key, row);
        
        // Atualiza o state local apenas se a requisição for bem-sucedida
        setUserList(prev => prev.map(user => 
          user.id === key ? { ...user, ...row, updatedAt: new Date().toISOString() } : user
        ));
        
        message.success('Usuário atualizado com sucesso');
      } catch (error) {
        console.error('Error:', error);
        message.error('Falha ao atualizar usuário');
      } finally {
        setLoading(false);
      }
    },
    onCancel: async (key) => {
      // Não faz nada, apenas sai do modo de edição
      console.log('Edição cancelada para o usuário:', key);
    },
    onDelete: async (key, row) => {
      try {
        setLoading(true);
        // Chama a função para deletar o usuário no backend
        await deleteUserById(key);
        
        // Atualiza o state local apenas se a requisição for bem-sucedida
        setUserList(prev => prev.filter(user => user.id !== key));
        
        message.success('Usuário removido com sucesso');
      } catch (error) {
        console.error('Error:', error);
        message.error('Falha ao remover usuário');
      } finally {
        setLoading(false);
      }
    },
    actionRender: (row, config, defaultDom) => [
      <Button 
        key="save" 
        type="primary"
        onClick={async () => {
          try {
            setLoading(true);
            await config.onSave(row.id, row);
          } finally {
            setLoading(false);
          }
        }}
      >
        Salvar
      </Button>,
      <Button 
        key="cancel" 
        style={{ marginLeft: 8 }}
        onClick={() => {
          config.onCancel(row.id);
          setEditableKeys([]);
        }}
      >
        Cancelar
      </Button>,
      <Popconfirm
        key="delete"
        title="Tem certeza que deseja excluir este usuário?"
        onConfirm={async () => {
          try {
            await config.onDelete(row.id, row);
          } catch (error) {
            console.error('Error:', error);
          }
        }}
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
      {renderCreateButton()}
      {renderCreateModal()}
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