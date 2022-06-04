import React, { Component } from 'react'
import {Form,Input} from 'antd'
export default class UpdateForm extends Component {
  myForm = React.createRef()
  UNSAFE_componentWillMount(){
    this.props.getform(this.myForm)
  }
  render() {
    const {category_name} = this.props
    return (
        <Form
        ref={this.myForm}
        initialValues={{categoryName:category_name}}
        >
        <Form.Item
        name='categoryName'
        rules={[
          {
            required: true,
            message: '分类名必须输入',
          },
        ]}>
            <Input  
            placeholder="请输入分类名"/>
        </Form.Item>
    </Form>
    )
  }
}


