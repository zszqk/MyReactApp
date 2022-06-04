import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

import './index.less'
import { reqGetProducts,reqSearchProducts, reqUpdateStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constants';
import withRouter from '../../utils/withRouter';
const { Option } = Select

// product的默认数组
class ProductHome extends Component {
  state = {
    total:0, //商品的总数量
    products:[], // 商品的数组
    loading: false, // 是否正在加载中
    searchName:'' ,//搜索的关键字
    searchType: 'productName' // 根据哪个字段搜索
  }
  // 初始化Columns
  initColumns = ()=>{
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
      },
      {
        title: '状态',
        width:100,
        render: (products)=>{
          const {status, _id} = products
          const newStatus = status === 1?2:1
          return(
            <span>
              <Button type='primary' onClick={()=>this.updateStatus(_id,newStatus)}>
                {status===1?'下架':'在售'}
              </Button>
              <span>
                {status===1?'在售':'下架'}
              </span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (products) => {
          return (
            <span>
              <Button type='link' onClick={()=>this.props.navigate('/product/detail',{state:{products}})}>详情</Button>
              <Button type='link' onClick={()=>this.props.navigate('/product/addupdate',{
                state:{products} //将产品相关信息传递过去，对应页面使用this.props.location.state接收
              })}>修改</Button>
            </span>
          )
        }
      },
    ]
    return columns
  }
  handleClick = ()=>{
    console.log(this.props)
  }
  // 获取指定页数据
  getProducts = async(pageNum)=>{
    // 保存pageNum，获取pageSize
    this.pageNum = pageNum
    const pageSize = PAGE_SIZE
    // 显示loading
    this.setState({loading:true})
    const {searchName,searchType} = this.state
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result
    if(searchName){
      // 发送请求
      result = (await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})).data
    }else{
      // 一般分页请求
      result = (await reqGetProducts(pageNum,pageSize)).data
    }
    // 隐藏loading
    this.setState({loading:false})
    // 设置初始化指定页商品products
    this.setState({
      total:result.data.total,
      products:result.data.list
    })
  }
  // 更新商品状态
  updateStatus = async(_id,newStatus)=>{
    const result = (await reqUpdateStatus(_id, newStatus)).data
    if(result.status===0){
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }
  UNSAFE_componentWillMount(){
    this.columns = this.initColumns()
  }
  componentDidMount(){
    // 初始化第一页
    this.getProducts(1)
  }
  render() {
    const {products,total,loading,searchType,searchName} = this.state
    const title = (
      <span>
        <Select
          style={{ width: 150 }}
          value={searchType}
          onChange={(value)=>this.setState({searchType:value})}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{ width: 150, margin: '0 15px' }}
          value={searchName}
          onChange={event => this.setState({searchName:event.target.value})}
        />
        <Button
          type='primary'
          onClick={()=>this.getProducts(1)}
        >搜索</Button>
      </span>
    )
    
    return (
      <Card 
      title={title} 
      extra={
      <Button 
      type='primary' 
      onClick={()=>this.props.navigate('/product/addupdate',{
        state:{products:{}} //将产品相关信息传递过去，对应页面使用this.props.location.state接收
      })}
      >
        <PlusOutlined />添加商品
        </Button>
    }
        className='product'>
        <Table
        columns={this.columns} 
        dataSource={products}
        bordered
        rowKey='_id'
        pagination={
          {
            current:this.pageNum,
            total,
            loading,
            defaultPageSize:PAGE_SIZE,
            showQuickJumper:true,
            onChange:this.getProducts
          }
        }
        />
      </Card>
    )}
}
export default withRouter(ProductHome)