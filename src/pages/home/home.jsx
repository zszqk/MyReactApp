import React, { Component } from 'react'
import home_img from './home_img.png'
import './home.less'
export default class Home extends Component {
  render() {
    return (
      <div className='home-content'>
        <div className='home-content-title'>
          <h1>欢迎使用测试平台！</h1>
        </div>
        <div className='home-content-img'>
          <img src={home_img} alt="简介" />
        </div>
      </div>
    )
  }
}
