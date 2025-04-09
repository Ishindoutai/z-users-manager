import React from 'react';
import { Form, Select } from 'antd';
import { User } from '../../types/user';

const { Option } = Select;

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  record: User;
  children: React.ReactNode;
}

const permissionOptions = [
  'admin',
  'editor',
  'viewer',
  'manager',
  'reports'
];

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please input ${title}!` }]}
        >
          <Select mode="multiple" style={{ width: '100%' }}>
            {permissionOptions.map(perm => (
              <Option key={perm} value={perm}>{perm}</Option>
            ))}
          </Select>
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;