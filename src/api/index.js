import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
const BASE = ''
//const BASE = 'http://47.102.40.110:3000
// 登录接口
export const reqLogin = (username,password)=>{return ajax(BASE + '/login', {username,password},'POST')}
// 添加用户
export const reqAdd = (user) => {return ajax(BASE+'/manage/user/add',user,'POST')}
// 天气查询
export const reqWeatherQuery = (citycode) =>{
    return new Promise((resolve,reject)=>{
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=db1e6720bc77b25ec608dec83c81e1f5&city=${citycode}&extensions=base&output=JSON`
        jsonp(url,{},(err,data)=>{
            // const {weather,city} = data.lives[0]
            // console.log(data.status,weather,city)
            if(!err&&data.status==='1'){ // 注意此处1是字符类型
                const {weather,city} = data.lives[0]
                resolve({weather,city})
            }
            else{
                message.error('天气请求失败')
            }
        })
    })
    
 }
 
// 获取分类
export const reqCategorys = (parentId)=>{return ajax(BASE+'/manage/category/list',{parentId})}
// 添加分类
export const reqAddCategory = (parentId,categoryName)=>{return ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')}
// 更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => {return ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')}
// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
// 获取指定页商品
export const reqGetProducts = (pageNum,pageSize) =>{return ajax(BASE+'/manage/product/list', {pageNum,pageSize})}
// 关键词搜索商品
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
  })
// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')
// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')
// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')
// 获取用户列表
export const reqGetUsers = ()=> ajax(BASE+'/manage/user/list')
// 删除用户
export const reqDeleteUser = (userId)=> ajax(BASE+'/manage/user/delete',{userId},'POST')
// 更新用户
export const reqUpdateUser = (user)=>ajax(BASE+'/manage/user/update',{...user},'POST')
// 添加用户
export const reqAddUser = (user)=>ajax(BASE+'/manage/user/add',{...user},'POST')
// 获取角色列表
export const reqGetRoles = ()=>ajax(BASE+'/manage/role/list')
// 添加角色
export const reqAddRole = (roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')
// 更新角色权限
export const reqUpdateRole = (role)=>ajax(BASE+'/manage/role/update',{...role},'POST')