import React, { Component } from 'react'
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { formateDate } from '../../utils/dateUtils'
import { reqWeatherQuery } from '../../api'
import storageUtils from '../../utils/storageUtils'
import withRouter from '../../utils/withRouter'
import menuList from '../../config/menuConfig'
import './index.less'

const { confirm } = Modal;

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()), //当前时间字符串
    weather: '', //天气的文本
    city: '',
  }
  // 获取天气,城市
  getWeather = async (citycode) => {
    const { weather, city } = await reqWeatherQuery(310000)
    this.setState({ weather, city })
  }
  // 获取用户名
  getUserName = () => {
    const { username } = storageUtils.getUser()
    return username
  }
  // 获取时间
  getDate = () => {
    this.intervalId  = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({ currentTime })
    }, 1000)
  }
  // 获取首页
  getTitle = () => {
    const path = this.props.location.pathname 
    let title
    menuList.forEach(item => {
      if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        // 如果有值才说明有匹配的
        if(cItem) {
          // 取出它的title
          title = cItem.title
        }
      }
    })
    return title
  }
  // 退出登录,使用antd的Modal对话框
  logout = ()=>{
    confirm({
      title: '确定退出吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk : ()=> {
        // 清除用户
        storageUtils.removeUser()
        // 跳转到登录界面
        this.props.navigate('/login')
      },
      onCancel() {
      },
    });
  }
  componentDidMount() {
    this.getDate()
    this.getWeather()
    // this.getTitle()
  }
  componentWillUnmount(){
    // 清除定时器
    clearInterval(this.intervalId)
  }
  render() {
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎{this.getUserName()}</span>
          <Button type="text" onClick={this.logout}>退出</Button>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{this.getTitle()}</div>
          <div className='header-bottom-right'>
            <span>{this.state.currentTime}</span>
            <span>{this.state.city}</span>
            <span>{this.state.weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
