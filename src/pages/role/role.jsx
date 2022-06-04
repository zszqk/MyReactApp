import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { reqGetRoles, reqAddRole, reqUpdateRole } from '../../api'
import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'
import withRouter from '../../utils/withRouter'
import AddRole from './add-role'
import AuthRole from './auth-role'

class Role extends Component {
  state = {
    roles: [],
    role: {},
    isModalVisible: false, //是否显示对话框
    isAdd: true, //添加还是设置对话框
  }
  auth = React.createRef()
  // 初始化columns
  initColumns = () => {
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        render: (role) => { return formateDate(role.create_time) }
      },
      {
        title: '授权时间',
        render: (role) => { return formateDate(role.auth_time) }
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
    this.columns = columns
  }
  // 获取角色列表
  getRoles = async () => {
    // 发送请求
    const result = (await reqGetRoles()).data
    if (result.status === 0) {
      const { data } = result
      this.setState({ roles: data })
    }
  }
  // 实现点击表格行的其他地方也能选中
  onRow = (role) => {
    return {
      onClick: event => {
        // console.log(role)
        this.setState({ role })
      }
    }
  }
  showModal = () => {
    this.setState({ isModalVisible: true })
  }
  cancelModal = () => {
    this.setState({ isModalVisible: false })
  }
  handleOk = async () => {

    if (this.state.isAdd) {
      const { getFieldsValue } = this.form.current
      // 添加角色
      const { name } = getFieldsValue()
      const result = (await reqAddRole(name)).data
      if (result.status === 0) {
        message.success('添加角色成功')
        // 设置新建角色被选中
        const role = result.data
        this.setState((state) => ({ roles: [...state.roles, role] }))
        this.cancelModal()
      }
      else {
        message.error('添加失败')
      }
    } else {
      //设置角色
      const { _id } = this.state.role //id
      const menus = this.auth.current.state.checkedKeys //权限key数组
      const auth_time = Date.now() //授权时间
      const auth_name = storageUtils.getUser().username //授权用户->当前登录用户
      const newRole = { _id, menus, auth_name, auth_time }
      // 发送请求
      const result = (await reqUpdateRole(newRole)).data
      if (result.status === 0) {
        // 如果当前更新的是自己角色的权限, 强制退出
        if (this.state.role._id === storageUtils.getUser().role_id) {
          storageUtils.removeUser()
          this.props.navigate('/login')
        } else {
          // 更新roles
          message.success('设置权限成功')
          const role = result.data
          this.setState((state) => ({ role }))
          this.getRoles()
          this.cancelModal()
        }

      } else {
        message.error('设置权限失败')
      }
    }

  }
  // 创建角色
  addRole = () => {
    this.setState({ isAdd: true })
    this.showModal()
  }
  // 设置角色权限
  authRole = () => {
    this.setState({ isAdd: false })
    this.showModal()
  }
  UNSAFE_componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getRoles()
  }
  render() {
    const { roles, role, isAdd, isModalVisible } = this.state
    const title = (
      <span>
        <Button type='primary' style={{ marginRight: 15 }} onClick={this.addRole}>创建角色</Button>
        <Button type='primary' disabled={!role._id} onClick={this.authRole}>设置角色权限</Button>
      </span>
    )
    return (
      <Card
        title={title}
        style={{ width: '100%', height: '100%' }}>
        <Table
          dataSource={roles}
          columns={this.columns}
          bordered
          rowKey='_id'
          pagination={{ defaultPageSize: 3 }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({ role })
            }
          }}
          onRow={this.onRow}
        />
        <Modal title={isAdd ? '添加角色' : '设置角色权限'} visible={isModalVisible} onOk={this.handleOk} onCancel={this.cancelModal}>
          {isAdd ?
            <AddRole setForm={(form) => this.form = form} />
            :
            <AuthRole role={role} ref={this.auth} />
          }
        </Modal>
      </Card>
    )
  }
}
export default withRouter(Role)