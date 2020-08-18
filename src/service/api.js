import Taro from "@tarojs/taro";
import { HTTP_STATUS } from "../utils/status";
import { base,base1 } from "./config";
import { logError } from "../utils/error";

export default {
  baseOptions(params, method = "GET") {
    let { url, data } = params;
    let contentType = "application/x-www-form-urlencoded";
    contentType = params.contentType || contentType;
    const option = {
      isShowLoading: false,
      loadingText: "正在加载",
      url: params.data.address===1?base + url:base1+url,
      data: data,
      method: method,
      header: { "content-type": contentType,wechat:params.data.address===1?'hfpn7a':wx.getStorageSync('platform') },
      success(res) {
        if(res.statusCode ===400) {

        }
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          wx.showToast({
            title:'平台号不存在',
            icon:'none'
          })
          return logError("api", "请求资源不存在");
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError("api", "服务端出现了问题");
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError("api", "没有权限访问");
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data;
        }
      },
        error(e) {
          logError("api", "请求接口出现问题", e);

        }
    };
    return Taro.request(option);
  },
  get(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option);
  },
  post: function(url, data) {
    let params = { url, data };
    return this.baseOptions(params, "POST");
  },
  put: function(url, data) {
    let params = { url, data };
    return this.baseOptions(params, "PUT");
  },
  del: function(url, data) {
    let params = { url, data };
    return this.baseOptions(params, "DELETE");
  }
};
