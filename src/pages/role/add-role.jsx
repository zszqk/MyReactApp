import React, { Component } from 'react'
import { Form, Input } from 'antd'
export default class AddRole extends Component {
    myForm = React.createRef()
    componentDidMount() {
        this.props.setForm(this.myForm)
    }
    render() {
        return (
            <Form 
            ref={this.myForm}
            initialValues={{name:''}}
            >
                <Form.Item name='name' label='角色名称'>
                    <Input placeholder='请输入角色名称' />
                </Form.Item>
            </Form>
        )
    }
}
