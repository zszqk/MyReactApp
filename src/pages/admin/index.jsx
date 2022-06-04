import React, { Component } from 'react'
import storageUtils from '../../utils/storageUtils'
// antd组件
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from 'antd';
// 一般组件
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';

// 引入路由组件
import Category from '../category/category'
import Home from '../home/home'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Order from '../order';
// 引入二级路由
import ProductHome from '../product/home'
import ProductAddUpdate from '../product/add-update'
import ProductDetail from '../product/detail'
const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = storageUtils.getUser()
    if (user.username)
      return (
        <Layout style={{ minHeight: '100%' }}>
          <Sider>
            <LeftNav />
          </Sider>
          <Layout>
            <Header />
            <div style={{ backgroundColor: "#f0f2f5", padding: "25px", height: "100%" }}>
              <Content style={{ backgroundColor: "white", height: "100%",width:"100%" }}>
                <Routes>
                  <Route path='*' element={<Home />}></Route>
                <Route path='/home' element={<Home />}></Route>
                  <Route path='/category' element={<Category />}></Route>
                  <Route path='/product/*' element={<Product />}>
                    <Route path='' element={<ProductHome />}></Route>
                    <Route path='addupdate' element={<ProductAddUpdate />}></Route>
                    <Route path='detail' element={<ProductDetail />}></Route>
                    {/* <Navigate to='/product/home'></Navigate> */}
                  </Route>
                  <Route path='/charts/bar' element={<Bar />}></Route>
                  <Route path='/charts/line' element={<Line />}></Route>
                  <Route path='/charts/pie' element={<Pie />}></Route>
                  <Route path='/user' element={<User/>}></Route>
                  <Route path='/role' element={<Role />}></Route>
                  <Route path='/order' element={<Order />}></Route>
                </Routes>
              </Content>
            </div>
            <Footer style={{ textAlign: "center", backgroundColor: "#f0f2f5" }}>推荐使用谷歌浏览器浏览以获得最佳体验</Footer>
          </Layout>
        </Layout>
      )
    else {
      return (
        <Navigate to='/login' />
      )
    }
  }
}
