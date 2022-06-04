import React, { Component } from 'react'
import './index.less'
import { Link } from 'react-router-dom';
import loginImg from '../../assets/images/login-head-icon.jpg'
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';
import wrapIcon from '../../utils/wrapIcon';
import withRouter from '../../utils/withRouter';
import storageUtils from '../../utils/storageUtils'
const { SubMenu } = Menu;

class LeftNav extends Component {
    state = {
        menus:[]
    }
    // 得到当前用户的权限数组
    getCurrentMenus = () => {
        const menus = storageUtils.getUser().role.menus
        const newMenus = menuList.map((item) => {
            if (!item.children) {

                return (
                    menus.includes(item.key) ? {
                        title: item.title,
                        key: item.key,
                        icon: item.icon
                    } : '0'
                )
            }
            else {
                const childrenMenus = item.children.map((ic) => {
                    return (
                        menus.includes(ic.key) ? {
                            title: ic.title,
                            key: ic.key,
                            icon: ic.icon
                        } : '0'
                    )
                })
                // // 过滤其中为'0'的值
                const newChildren = []
                childrenMenus.forEach(e => {
                    if (e !== '0') newChildren.push(e)
                })
                if (newChildren.length !== 0) {
                    return (
                        {
                            title: item.title,
                            key: item.key,
                            icon: item.icon,
                            children: newChildren
                        }
                    )
                }
            }
        })
        // 过滤其中为'0'和莫名其妙产生的undefined的值
        const test = []
        newMenus.forEach(element => {
            if (element !== '0' && !!element) test.push(element)
        });
        this.setState({menus:test})
    }
    // 将menulist配置数组生成node节点
    getMenuNodes = (menus) => {

        return menus.map(item => {
            if (!item.children) {
                return <Menu.Item key={item.key} icon={wrapIcon(item.icon)}>
                    <Link to={item.key}>{item.title}</Link>
                </Menu.Item>
            }
            else {
                const path = this.props.location.pathname
                item.children.find(key => {
                    if (key.key === path)
                        this.openKey = item.key
                    return key
                })
                return <SubMenu key={item.key} icon={wrapIcon(item.icon)} title={item.title}>
                {this.getMenuNodes(item.children)}
            </SubMenu>
            }
        })
    }
    UNSAFE_componentWillMount() {
        this.getCurrentMenus()
        // console.log(storageUtils.getUser().role.menus)
    }
    render() {
        const path = this.props.location.pathname
        // console.log(this.getCurrentMenus())
        return (
            <div className='left-nav'>
                <Link to="/" className='left-nav-header'>
                    <img src={loginImg} alt="" />
                    <h1>烧烤摊</h1>
                </Link>
                <div className='left-nav-menu'>
                    <Menu
                        selectedKeys={[path]}
                        defaultOpenKeys={[this.openKey]}
                        mode="inline"
                        theme="dark"
                    >
                        {this.getMenuNodes(this.state.menus)}
                    </Menu>
                </div>

            </div>
        )
    }
}
export default withRouter(LeftNav)
