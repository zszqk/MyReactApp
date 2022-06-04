// 发送异步Ajax请求的模块
// 返回值是一个promise对象
// 统一处理错误请求
import axios from 'axios'
import { message } from 'antd'
export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve,reject)=>{
        let promise
        if (type === "GET") {
            promise = axios.get(url,{
                params: data
            })
        }
        else {
            promise = axios.post(url, data)
        }
        promise.then(response=>{
            resolve(response)
        }).catch(err=>{
            message.error("请求失败！"+err.message)
        })
    })
    

}   