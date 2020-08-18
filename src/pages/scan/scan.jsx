import Taro, { Component } from "@tarojs/taro";
import { AtMessage } from "taro-ui";
import api from "../../service/api";
import "./scan.scss";
class Scan extends Component {
  onScan = () => {
    const _that = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: "qrCode",
      success(res) {
        wx.showModal({
          title: "提示",
          content: "确认开机？",
          success(r) {
            if (r.confirm) {
              _that._startComputer(res);
            } else if (r.cancel) {
              wx.navigateBack({
                delta: -1
              });
            }
          }
        });
      },
      fail(err) {
        Taro.atMessage({
          message: "操作失败!",
          type: "info"
        });
      }
    });
  };
  // 调用后台开机接口
  _startComputer = qr_info => {
    const userinfo = wx.getStorageSync("userInfo") || {};
    wx.showLoading({
      title: "开机中"
    });
    wx.login({
      success(res) {
        if (res.code) {
          api
            .post("deviceapi/equip_status/one_key_open", {
              code:res.code,
              imei: qr_info.path
                ? qr_info.path.split("?")[1].split("=")[1]
                : qr_info.result
                ? qr_info.result
                : "",
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
                  message: r.data.msg,
                  type: "error"
                });
              }
            });
        }
      }
    });
  };
  render() {
    return (
      <View className="container">
        <AtMessage />
        <View className="scan_wrapper">
          <View className="round round_1"></View>
          <View className="round round_2"></View>
          <View className="round round_3" onClick={this.onScan}>
            <Button
              hover-class="hover"
              hover-stay-time="180"
              className="base_hover"
            >
              扫码
            </Button>
          </View>
        </View>

        <View className="notice">
          <Text className="text">扫码一键开机</Text>
        </View>
      </View>
    );
  }
}
export default Scan;
