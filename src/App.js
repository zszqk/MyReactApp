/*
应用根组件
*/
import React, { Component, Fragment } from 'react'
// 引入路由
import { Route, Routes,Navigate} from 'react-router-dom';
import Login from './pages/login';
import Admin from './pages/admin';
import Test from './pages/test'

export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Routes>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/*' element={<Admin />}></Route>
                    <Route path='/test' element={<Test />} ></Route>
                    <Route path="/" element={<Navigate to="/home"/>} />
                </Routes>
            </Fragment>
        )

    }
}
