import React from 'react';
import { Form, Select } from 'antd';
import { EditableCellProps } from '../../types/user';

const { Option } = Select;

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  const permissionOptions = [
    'admin',
    'editor',
    'viewer',
    'manager',
    'reports',
  ];

  const permissions = record?.permissions || [];

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          initialValue={permissions}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
            {
              validator: (_, value) => {
                if (value && value.length === 0) {
                  return Promise.reject(new Error('At least one permission is required'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Select mode="multiple" style={{ width: '100%' }}>
            {permissionOptions.map(perm => (
              <Option key={perm} value={perm}>
                {perm}
              </Option>
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