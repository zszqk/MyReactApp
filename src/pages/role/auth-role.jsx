import React, { Component } from 'react'
import { Tree, Form, Input } from 'antd'
import menuList from '../../config/menuConfig';
export default class AuthRole extends Component {
  myForm = React.createRef()
  myTree = React.createRef()
  state = {
    checkedKeys:this.props.role.menus
  }
  // 树形控件数据
  getTreeData = (menuList)=>{
    let newTreeData = []
    menuList.map((menu)=>{
      if(!menu.children){
        return newTreeData.push({title:menu.title,key:menu.key})
      }else{
        return newTreeData.push({title:menu.title,key:menu.key,children:this.getTreeData(menu.children)})
      }
    })
    return newTreeData
  }
  onCheck = (checkedKeys) => {
    this.setState({checkedKeys})
  }
  UNSAFE_componentWillMount(){
    const data = this.getTreeData(menuList)
    this.treeData = [
      {
        title: '平台权限',
        key: 'all',
        children: data
      },
    ]
    // this.setState({checkKeys:this.props.role.menus}) 只会执行一次,所以不能放在这了
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    this.setState({checkedKeys:nextProps.role.menus})
    
  }
  componentDidMount(){
  }
  
  render() {
    const {checkedKeys} = this.state
    const {name} = this.props.role
    const {treeData} = this
    // console.log(checkedKeys)
    return (
      <Form
      ref={this.myForm}
      >
        <Form.Item label='角色名称'>
          <Input disabled value={name}/>
        </Form.Item>
        <Form.Item>
          <Tree
            ref={this.treeRef}
            checkable
            defaultExpandAll={true}
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
            treeData={treeData}
          />
        </Form.Item>
      </Form>
    )
  }
}
