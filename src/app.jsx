import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'
import api from '../src/service/api'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      "pages/personal/personal",
      "pages/breakdown/breakdown",
      "pages/login/login",
      "pages/cropper/cropper",
      "pages/scan/scan",
    ],
    "tabBar": {
      "color": "#7d7d7d",
      "selectedColor": "#3275ff",
      "borderStyle": "black",
      "backgroundColor": "#ffffff",
      "list": [
        {
          "pagePath": "pages/index/index",
          "iconPath": "assets/images/home.png",
          "selectedIconPath": "assets/images/Selecthoem.png",
          "text": "主页"
        },
        {
          "pagePath": "pages/personal/personal",
          "iconPath": "assets/images/user.png",
          "selectedIconPath": "assets/images/seletuser.png",
          "text": "个人中心"
        }
      ]
    },
    "window": {
      "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#fff",
      "navigationBarTitleText": "弈简运维管控平台",
      "navigationBarTextStyle": "black"
    },
    "networkTimeout": {
      "request": 15000,
      "connectSocket": 15000,
      "uploadFile": 15000,
      "downloadFile": 15000
    },

  }

  componentDidMount () {
    const updateManager = wx.getUpdateManager()
    // 检查小程序是否有新版本发布
    updateManager.onCheckForUpdate(function(res){
      // 请求完新版本的信息回调
      if(res.hasUpdate){
        wx.showModal({
          title: '更新提示',
          content: '检查到新版本，是否下载新版本并重启小程序？',
          success:function(res){
            if(res.confirm){
              // 下载
              self.downloadAndUpdate(updateManager)
            }else if(res.cancel){
              // 点击取消，做强制更新操作
              wx.showModal({
                title: '温馨提示',
                content: '必须强制更新哦，旧版本无法正常使用',
                showCancel:false,//隐藏取消按钮
                confirmText:'确定更新',
                success:function(res){
                  if(res.confirm){
                    // 再次调用下载，并重启
                    self.downloadAndUpdate(updateManager)
                  }
                }
              })

            }
          }
        })
      }
    })

  }



  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
