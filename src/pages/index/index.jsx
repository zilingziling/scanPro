import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Swiper, SwiperItem } from "@tarojs/components";
import { AtMessage } from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { version } from "../../service/config";
class Index extends Component {
  config = {
    navigationBarTitleText: "弈简运维管控平台"
  };
  state = {
    scan_open: "",
    fault: ""
  };
  componentDidMount() {
    let { key } = this.$router.params;
    const that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.setStorageSync("code", res.code);
          api
            .get("wechatmanage/ytjOpenId/findPlatformNoByCode", {
              code: res.code,
              address: 1
            })
            .then(r => {
              if (r.data.code === 1) {
                // 用openid登录后绑定
                wx.setStorageSync("openId", r.data.data.openId);
                //   未绑定，需要登陆后调用登陆接口
                wx.redirectTo({
                  url: "/pages/login/login"
                });
              } else if (r.data.code === 0) {
                //     获取个人操作信息
                wx.setStorageSync("openId", r.data.data.openId);
                // 存平台号
                wx.setStorageSync("platform", r.data.data.platformNo);
                // 已绑定 返回openId，平台号，老师id，
                // 获取操作信息等
                api
                  .post("deviceapi/base_teacher/return_applet", {
                    address: 2,
                    version
                  })
                  .then(response => {
                    if (response.data.code === 200) {
                      that.setState({
                        fault: response.data.data.fault,
                        scan_open: response.data.data.scan_open
                      });
                      wx.setStorageSync("handleInfo", response.data.data);
                    }
                  });
                //  自动登陆
                api
                  .post("deviceapi/base_teacher/login", {
                    teacherId: r.data.data.teacherId,
                    // pwd: md5(password),
                    address: 2
                  })
                  .then(result => {
                    if (result.data.code === 200) {
                      wx.setStorageSync("userInfo", result.data.data);
                    }
                  });
                //   是否是扫码进来
                if (key) {
                  wx.showModal({
                    title: "提示",
                    content: "是否直接开机？",
                    success(res) {
                      if (res.confirm) {
                        that._startComputer(key);
                      } else if (res.cancel) {
                      }
                    }
                  });
                }
              } else {
                wx.showToast({
                  title: "绑定失败！",
                  icon: "none"
                });
              }
            });
        } else {
          console.log("调用wx.login()失败！" + res.errMsg);
        }
      }
    });
  }

  getOpeName = () => {};

  // 调用后台开机接口
  _startComputer = key => {
    const userinfo = wx.getStorageSync("userInfo") || {};
    wx.showLoading({
      title: "开机中..."
    });
    wx.login({
      success(res) {
        if (res.code) {
          api
            .post("deviceapi/equip_status/one_key_open", {
              code: res.code,
              imei: key,
              teacherid: userinfo.teacherId,
              address: 2
            })
            .then(r => {
              if (r.data.code === 200) {
                wx.hideLoading();
                Taro.atMessage({
                  message: "操作成功请查看设备!",
                  type: "success"
                });
              } else {
                wx.hideLoading();
                Taro.atMessage({
                  message:  r.data.msg,
                  type: "error"
                });
              }
            });
        }
      }
    });
  };

  render() {
    const { fault, scan_open } = this.state;
    return (
      <View className="indexContent">
        <AtMessage />
        <View className="contentWrap">
          <View
            className="blue"
            onClick={() =>
              Taro.navigateTo({
                url: "/pages/scan/scan"
              })
            }
          >
            <Text className="text">{scan_open||'扫码开机'}</Text>
          </View>
          <View
            className="green"
            onClick={() =>
              Taro.navigateTo({
                url: "/pages/breakdown/breakdown"
              })
            }
          >
            <Text className="text">{fault||'人脸注册'}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
