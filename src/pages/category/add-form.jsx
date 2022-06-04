import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select
export default class AddForm extends Component {
  myForm = React.createRef()
  UNSAFE_componentWillMount() {
    this.props.addform(this.myForm)
  }
  componentDidMount(){
    this.myForm.current.setFieldsValue({parentId:this.props.parentId})
  }
  render() {
    const { categorys, parentId } = this.props
    return (
      <Form
        ref={this.myForm}
        initialValues={
          { parentId }
        }>
        <Form.Item
          name='parentId'
          rules={[
            { 
              required: true,
              message: '分类名称必须输入' }
          ]
          }
        >
          <Select
          >
            <Option value="0">一级分类</Option>
            {
              categorys.map(category => {
                return <Option key={category._id} value={category._id}>{category.name}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          name='categoryName'>
          <Input placeholder='请输入分类名' />
        </Form.Item>
      </Form>
    )
  }
}
