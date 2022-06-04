import React, { Component } from 'react'
import withRouter from '../../utils/withRouter'
import { Button, Card, List } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqCategory } from '../../api/index'
import {BASE_IMG_URL} from '../../utils/constants'
class ProductDetail extends Component {
  state = {
    cName1: '', // 一级分类名称
    cName2: '' //二级分类名称
  }
  initTitle = () => {
    const title = (
      <span>
        <Button
          type='link'
          onClick={() => this.props.navigate(-1)}>
          <ArrowLeftOutlined style={{ marginRight: 5, fontSize: 20 }} />
        </Button>
        <span>商品详情</span>
      </span>
    )
    return title
  }
  UNSAFE_componentWillMount() {
    this.title = this.initTitle()
  }
  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.products
    if (pCategoryId === '0') {//一级分类所属
      const result = (await reqCategory(categoryId)).data
      this.setState({
        cName1: result.data.name
      })
    } else {
      const result1 = (await reqCategory(categoryId)).data
      const result = (await reqCategory(pCategoryId)).data
      this.setState({
        cName1: result.data.name,
        cName2: result1.data.name
      })
    }
  }
  render() {
    // console.log(this.props.location.state)
    const { products } = this.props.location.state
    const { cName1, cName2 } = this.state
    return (
      <Card
        title={this.title}
        style={{ width: '100%', height: '100%' }}
        bordered>
        <List>
          <List.Item>
            <span style={{ marginRight: '15px', fontSize: '20px', fontWeight: 'bold' }}>商品名称:</span>
            <span>{products.name}</span>
          </List.Item>
          <List.Item>
            <span style={{ marginRight: '15px', fontSize: '20px', fontWeight: 'bold' }}>商品描述:</span>
            <span>{products.desc}</span>
          </List.Item>
          <List.Item>
            <span style={{ marginRight: '15px', fontSize: '20px', fontWeight: 'bold' }}>商品价格:</span>
            <span>{products.price}元</span>
          </List.Item>
          <List.Item>
            <span style={{ marginRight: '15px', fontSize: '20px', fontWeight: 'bold' }}>所属分类:</span>
            <span>{cName2 ? (cName1 + '-->' + cName2) : cName1}</span>
          </List.Item>
          <List.Item>
            <span style={{ marginRight: '15px', fontSize: '20px', fontWeight: 'bold' }}>商品图片:</span>

            <span>
              {
                products.imgs.length>0?(
                  products.imgs.map(img => {
                    return <img src={BASE_IMG_URL + img} alt='img' key={img} style={{width:40,height:40}}/>
                  })
                ):'暂无图片'
              }
            </span>
          </List.Item>
          <List.Item>
            <span style={{ marginRight: '15px', fontSize: '20px', fontWeight: 'bold' }}>商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: products.detail ? products.detail : '暂无详情介绍' }}></span>
          </List.Item>
        </List>
      </Card>
    )
  }
}
export default withRouter(ProductDetail)
