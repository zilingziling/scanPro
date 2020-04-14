import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Input, Image } from "@tarojs/components";
import { AtMessage } from "taro-ui";
import api from "../../service/api";
import logo from "../../assets/images/log.png";
import ClassNames from "classnames";
import "./login.scss";
import md5 from "../../utils/md5";
import { version } from "../../service/config";
class Login extends Component {
  config = {
    navigationBarTitleText: "弈简运维管控平台"
  };
  state = {
    userName: "",
    password: "",
    platform: "",
    clicked: 1
  };

  componentDidMount() {
    wx.login({
      success(res) {
        if (res.code) {
          api.get("wechatmanage/ytjOpenId/findPlatformNoByCode", {
              code: res.code,
              address: 1
            })
            .then(r => {
              if (r.data) {
                wx.setStorageSync("openId", r.data.data.openId);
              }
            });
        }
      }
    });
  }

  clear = () => {
    this.setState({
      userName: "",
      password: "",
      platform: "",
      clicked: 1
    });
  };
  login = () => {
    const { platform, password, userName } = this.state;
    if (!platform || !password || !userName) {
      wx.showToast({
        title: "请先填写参数！",
        icon: "none"
      });
    } else {
      let reg = /^[0-9a-zA-Z]+$/;
      if (reg.test(platform)) {
        // 存平台号
        wx.setStorageSync("platform", platform);
        api
          .post("deviceapi/base_teacher/login", {
            code: wx.getStorageSync("code"),
            account: userName,
            pwd: md5(password),
            address: 2
          })
          .then(r => {
            if (r.data.code === 200) {
              Taro.atMessage({
                message: r.data.msg,
                type: "success"
              });
              wx.setStorageSync("userInfo", r.data.data);
              // 调绑定接口
              api
                .get("wechatmanage/ytjOpenId/binding", {
                  openId: wx.getStorageSync("openId"),
                  address: 1,
                  platformNo: platform,
                  teacherIdServer: r.data.data.teacherId
                })
                .then(resp => {
                  if (resp.data.code === 0) {
                    wx.setStorageSync('description',resp.data.data.description)
                    Taro.switchTab({
                      url: "../index/index"
                    });
                    this.clear();
                  } else {
                    Taro.atMessage({
                      message: resp.data.msg,
                      type: "error"
                    });
                  }
                });
            } else {
              Taro.atMessage({
                message: r.data.msg,
                type: "error"
              });
            }
          });
      } else {
        wx.showToast({
          title: "平台号只能包含数字和字母！",
          icon: "none"
        });
      }
    }
  };
  render() {
    const { platform, password, userName, clicked } = this.state;
    return (
      <View className="loginWrapper">
        <AtMessage />
        <View className="logo">
          <Image className="logoImg" src={logo} />
          <Text className="name">弈简运维管控平台</Text>
        </View>
        <View className="form">
          <View
            className={ClassNames("platForm", clicked === 1 ? "clicked" : "")}
          >
            <Text space="emsp" className="label">
              平 台 号:
            </Text>
            <Input
              onFocus={() => this.setState({ clicked: 1 })}
              value={platform}
              onInput={e => this.setState({ platform: e.target.value })}
              className="input"
              placeholder="请输入平台号"
              placeholderClass="placeholder"
            ></Input>
          </View>
          <View
            className={ClassNames("platForm", clicked === 2 ? "clicked" : "")}
          >
            <Text space="emsp" className="label">
              管理员账号:
            </Text>
            <Input
              maxLength={18}
              onFocus={() => this.setState({ clicked: 2 })}
              value={userName}
              onInput={e => this.setState({ userName: e.target.value })}
              className="input"
              placeholder="请输入身份证号码"
              placeholderClass="placeholder"
            ></Input>
          </View>
          <View
            className={ClassNames("platForm", clicked === 3 ? "clicked" : "")}
          >
            <Text space="emsp" className="label">
              密 码:
            </Text>
            <Input
              onFocus={() => this.setState({ clicked: 3 })}
              value={password}
              onInput={e => this.setState({ password: e.target.value })}
              className="input"
              placeholder="请输入助教系统密码"
              placeholderClass="placeholder"
            ></Input>
          </View>
        </View>
        <Button className="login animation" type="primary" onClick={this.login}>
          登录
        </Button>
        <Button className="clear animation" type="" onClick={this.clear}>
          清除
        </Button>
        <Text className="version">版本{version}</Text>
      </View>
    );
  }
}

export default Login;
