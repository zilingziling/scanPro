import  Taro,{Component} from '@tarojs/taro'
import { View, Button, Text, Input,Image } from "@tarojs/components";
import {AtMessage  } from "taro-ui";
import api from '../../service/api'
import './personal.scss'
class Personal extends Component{
  state={
    name:wx.getStorageSync('userInfo').teacherName,
    platform:wx.getStorageSync('platform'),
    text:''
  }
  componentDidMount(){
    api.post('wechatmanage/client/findByClientId',{
      clientId:wx.getStorageSync('platform'),
      address:1
    }).then(r=>{
      if(r.data.code===0){
        this.setState({
          text:r.data.data
        })
      }
    })
  }
  logout=()=>{
    wx.showModal({
      title: '提示',
      content: '是否退出登陆？',
      success(res) {
        if (res.confirm) {
          api.get('wechatmanage/ytjOpenId/remove',{
            openId:wx.getStorageSync('openId'),
            address:1
          }).then(r=>{
            if(r.data.code===0){
              wx.showToast({
                title: r.data.msg,
                icon: 'none'
              })
              wx.clearStorageSync();
              wx.redirectTo({
                url: '/pages/login/login'
              })
            }
          })

        }
      }
    })
  }
  render(){
    const {name,platform,text}=this.state
    return (
      <View>
        <AtMessage />
        <View className='userinfo'>
          <View className='userTest'>用户名：{name}</View>
          <View className='userTest'>平台号：{platform}</View>
          <View className='userTest'>平台描述：{text}</View>
          <Button onClick={this.logout} hover-stay-time="180" hover-class="hover"className='btn base_hover userbnt'>退出登录</Button>

        </View>

      </View>
    )
  }
}
export default Personal
