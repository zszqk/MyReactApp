import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, message, Form, Input, Select } from 'antd'
import { reqGetUsers, reqDeleteUser, reqUpdateUser, reqAddUser } from '../../api'
import { formateDate } from '../../utils/dateUtils'
import { QuestionCircleOutlined } from '@ant-design/icons'
export default function User(props) {

  // 表格数据;表头以及数据

  const columns = [
    { title: '用户名', dataIndex: 'username' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '电话', dataIndex: 'phone' },
    {
      title: '注册时间',
      render: (user) => {
        const { create_time } = user
        return (formateDate(create_time))
      }
    },
    {
      title: '所属角色',
      render: (user) => getRoles(user.role_id)
    },
    {
      title: '操作',
      render: (user) => {
        return (
          <>
            <Button type='link' onClick={() => updateUser(user)}>修改</Button>
            <Button type='link' onClick={() => showConfirm(user)}>删除</Button>
            <Button />
          </>
        )
      }
    }
  ]
  // state 数据
  const [users, setUsers] = useState([]) //所有用户列表
  const [roles, setRoles] = useState([]) //所有角色列表
  const [isModalVisible, setIsModalVisible] = useState(false) // 是否展示Modal对话框
  const [isUpdate, setIsUpdate] = useState() //false创建用户的对话框；true:修改用户的对话框
  const [user, setUser] = useState({})  // 当前用户

  // 表单数据
  const [form] = Form.useForm()
  //获取所属角色
  const getRoles = (role_id) => {
    const role = roles.find((role) => {
      return role._id === role_id
    })
    return role.name
  }
  // 获取用户列表
  const getUsers = async () => {
    const result = (await reqGetUsers()).data
    // 取出用户以及角色数组
    const { users, roles } = result.data
    // 初始化状态
    setUsers(users)
    setRoles(roles)
    // console.log(users, roles)
  }
  // 删除用户对话框显示confirm对话框
  const showConfirm = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      icon: <QuestionCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const result = (await reqDeleteUser(user._id)).data
        if (result.status === 0) {
          message.success('删除用户成功')
          // 重新获取用户列表
          getUsers()
        }
      }
    });
  }
  // 显示Modal对话框
  const showModal = () => {
    setIsModalVisible(true);
  };
  // ok操作
  const handleOk = async () => {
    // 判断是修改还是添加
    if (isUpdate) {//修改
      // 保存数据
      const { _id } = user
      const { username, phone, email, role_id } = form.getFieldsValue()
      const newUser = { _id, username, phone, email, role_id }
      // 发送请求
      const result = (await reqUpdateUser(newUser)).data
      if (result.status === 0) {
        message.success(`${isUpdate ? '修改' : '添加'}用户成功`)
        // 更新用户列表
        getUsers()
        setIsModalVisible(false)
      }
    } else {//添加
      // 保存数据
      const newUser = form.getFieldsValue()
      // 发送请求
      const result = (await reqAddUser(newUser)).data
      if (result.status === 0) {
        message.success(`${isUpdate ? '修改' : '添加'}用户成功`)
        // 更新用户列表
        getUsers()
        setIsModalVisible(false)
      }
    }

  };
  // cancel操作
  const handleCancel = () => {
    // 清空form
    // form.resetFields()
    setIsModalVisible(false);
  };
  // 创建用户
  const createUser = () => {
    setIsUpdate(false)
    setUser({})
    // 清空form
    form.setFieldsValue(user)
    showModal()
  }
  // 修改用户
  const updateUser = (user) => {

    setIsUpdate(true)
    // 保存当前用户用于默认值显示
    setUser(user)
    // 清空form
    form.setFieldsValue(user)
    showModal()
    // console.log(form,user)

  }
  // 卡片头部的创建用户按钮
  const title = <Button type='primary' onClick={createUser}>创建用户</Button>
  // 生命周期hook
  useEffect(() => {
    getUsers()//获取用户列表
  }, [])
  return (
    <Card title={title} style={{ width: '100%', height: '100%' }}>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        bordered
        pagination={{ defaultPageSize: 2 }}
      />
      <Modal 
      title={isUpdate ? '修改用户' : '添加用户'} 
      visible={isModalVisible} 
      onOk={handleOk} 
      onCancel={handleCancel}
      destroyOnClose
      >
        <Form
          form={form}
          preserve={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 15 }}
          initialValues={{
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role_id
          }}
        >
          <Form.Item label='用户名' name='username' rules={[
            {
              required: true,
              message: '请输入用户名',
            }
          ]}>
            <Input placeholder='请输入用户名' />
          </Form.Item>
          {isUpdate ? null :
            <Form.Item label='密码' name='password' rules={[
              {
                required: true,
                message: '请输入密码',
              }
            ]}>
              <Input placeholder='请输入密码' type='password' />
            </Form.Item>
          }
          <Form.Item label='手机号' name='phone' rules={[
            {
              required: true,
              message: '请输入手机号',
            }
          ]}>
            <Input placeholder='请输入手机号' />
          </Form.Item>
          <Form.Item label='邮箱' name='email' rules={[
            {
              required: true,
              message: '请输入邮箱',
            }
          ]}>
            <Input placeholder='请输入邮箱' />
          </Form.Item>
          <Form.Item label='角色' name='role_id' rules={[
            {
              required: true,
              message: '请选择所属角色',
            }
          ]}>
            <Select>
              {roles.map((role) => {
                return (
                  <Select.Option value={role._id} key={role._id}>{role.name}</Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
