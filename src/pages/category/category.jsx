import React, { Component } from 'react'
import { Card, Button, Table, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import './index.less'

import { reqCategorys, reqUpdateCategory,reqAddCategory} from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component {
  state = {
    loading: false,
    parentId: '0', // 
    parentName: '', // 分类名
    categorys: [],//分类列表
    subCategorys: [], // 子分类列表
    showModal: 0 //0表示都不显示;1表示添加;2表示修改
  }
  // 初始化table列
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 300,
        render: (category) => ( // 此处的category表示包含被点击行的所有数据的对象
          <span>
            <Button type='link' onClick={() => this.updateCategroy(category)}>修改分类</Button>&nbsp;
            {this.state.parentId === '0' ? <Button type='link' onClick={() => { this.showSubCategorys(category) }}>查看子分类</Button> : null}
          </span>
        ),
      },
    ];
  }
  // 获取分类列表(一级还是子分类都用)
  getCategorys = async () => {
    // 设置loading
    this.setState({ loading: true })
    const result = (await reqCategorys(this.state.parentId)).data
    this.setState({ loading: false })
    if (result.status === 0) {
      if (this.state.parentId === '0') {
        const categorys = result.data
        // 更新一级分类列表
        this.setState({ categorys })
      }
      else {
        // 更新子分类
        const subCategorys = result.data
        this.setState({ subCategorys })
      }

    }
  }
  // 显示子分类
  showSubCategorys = (category) => {
    const { _id, name } = category
    this.category = category
    this.setState({ parentId: _id, parentName: name },
      () => {
        // 该回调会在state和render之后触发(解决setstate异步更新的问题)
        this.getCategorys()
      })

  }
  // 切回到父分类
  showCategorys = () => {
    this.setState({
      parentId: '0',
      subCategorys: [],
      parentName: ''
    })
  }
  // 取消对话框
  cancelModal = () => {
    // console.log(this.category.name)
    // 清除字段
    
    // 隐藏确认框
    this.setState({ showModal: 0 })
  }
  // 添加列表的对话框
  addCategroyModal = () => {
    // console.log(this.category)
    if(typeof(this.form)!=="undefined" ){
      this.form.current.setFieldsValue({parentId:this.category._id})
    }
    this.setState({ showModal: 1 })
  }
  // 修改列表的对话框
  updateCategroy = (category) => {
    this.category = category
    if(typeof(this.form)!=="undefined" ){
      this.form.current.setFieldsValue({categoryName:this.category.name})
    }
    this.setState({ showModal: 2 })
  }
  //添加分类
  handleAddOk = async() => {
    // console.log('添加', this.form.current.getFieldsValue())
    // 获取数据
    const {parentId,categoryName} = this.form.current.getFieldsValue()
    // 清除输入数据
    this.form.current.resetFields()
    // 判断一级分类还是二级分类;这里不用判断后端会根据传递的parentId值分辨是父分类还是子分类
    // const result = (await reqAddCategory(parentId,categoryName)).data
    // 发送请求
    await reqAddCategory(parentId,categoryName)
    // 重新设置state
    this.getCategorys()
    // 取消对话框
    this.cancelModal()
  }
  // 修改列表
  handleUpdateOk = async () => {
    // 准备数据
    const categoryName = this.form.current.getFieldValue('categoryName')
    // console.log(this.category._id,categoryName)
    // 清除输入数据
    this.form.current.resetFields()
    // 发送修改分类请求
    const result = (await reqUpdateCategory({ categoryId: this.category._id, categoryName})).data
    if (result.status === 0) {
      // 重新设置state
      this.getCategorys()
      this.cancelModal()
    }
    else{
      console.log(result.msg)
    }

  }
  
  UNSAFE_componentWillMount() {
    this.initColumns()

  }
  componentDidMount() {
    this.getCategorys()
  }
  render() {
    const { categorys, loading, parentId, parentName, subCategorys, showModal } = this.state
    const category = this.category || {} // 如果还没有指定一个空对象
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <Button type='link' onClick={this.showCategorys}>一级分类列表</Button>
        <ArrowRightOutlined />&nbsp;
        <span>{parentName}</span>
      </span>
    )
   
    return (
      <Card title={title}
        extra={<Button type='primary' onClick={this.addCategroyModal}><PlusOutlined />添加</Button>}
        className="category">
        <Table
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          rowKey={'_id'} // 设置key值,不然会报错
          bordered
          loading={loading}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
        <Modal title="添加分类" visible={showModal === 1} onOk={this.handleAddOk} onCancel={this.cancelModal}>
          <AddForm categorys={categorys} addform={form=>this.form=form} parentId={parentId}/>
        </Modal>
        <Modal title="修改分类" visible={showModal === 2} onOk={this.handleUpdateOk} onCancel={this.cancelModal}>
          <UpdateForm getform={form=>this.form=form} category_name={category.name} />
        </Modal>
      </Card>
    )
  }
}
