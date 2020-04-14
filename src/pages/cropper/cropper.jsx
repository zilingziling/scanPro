import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import TaroCropper from "taro-cropper";
import { connect } from '@tarojs/redux'
import { setValue } from '../../actions/counter'
@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  setValue(data) {
    dispatch(setValue(data))
  },
}))
class Cropper extends Component {

  state = {
    src: "",

  };
  componentDidMount(){
    this.upload()

  };
  onCut = res => {
    this.props.setValue(res)
    wx.navigateBack({
      delta: -1
    });
  };

  upload=()=> {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        //重置图片角度、缩放、位置
        that.setState({
          src: tempFilePaths,
        });
      },
      fail(){
        wx.navigateBack({
          delta: -1
        });
      }
    })
  }
  onCancel=()=>{
    wx.navigateBack({
      delta: -1
    });
  }
  render() {
    const { src } = this.state;
    return (
      <View>
        {
          src?<TaroCropper
            fullScreen
            height={1000}
            src={src}
            onCut={this.onCut}
            cropperWidth={400}
            cropperHeight={400}
            hideCancelText={false}
            quality={1}
            onCancel={this.onCancel}
          />:null
        }

      </View>
    );
  }
}

export default Cropper;
