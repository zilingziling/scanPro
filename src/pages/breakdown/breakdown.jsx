import  Taro,{Component} from '@tarojs/taro'
import { View, Button, Text, Input,Image,RadioGroup,Radio,Label,CoverImage } from "@tarojs/components";
import {AtMessage  } from "taro-ui";
import ClassNames from 'classnames'
import './breakdown.scss'
import { connect } from '@tarojs/redux'
import { setValue } from '../../actions/counter'
import {base1} from '../../service/config'
@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  setValue(data) {
    dispatch(setValue(data))
  },
}))

class Breakdown extends Component{
  state={
    selectRadio:'1',
    faultinfo:{},
    handleData:{},

  }
  componentDidMount(){
    this.getInfo()
    let data = wx.getStorageSync('handleInfo')
    wx.setNavigationBarTitle({
      title: data.fault,
    })
    this.setState({ handleData: data})
  }
  // 获取用户信息
  getInfo(){
    let info = wx.getStorageSync('userInfo');
    this.setState({
      faultinfo: {
        name: info.teacherName,
        account: info.teacherAccount,
        schoolname: info.schoolName
      }
    })
  }
  // 选择radio
  onSelectRadio=(e)=>{
    this.setState({
      selectRadio: e.target.value,
      faultinfo: null,
    })
    this.props.setValue('')
    if(e.target.value === "1"){
      this.getInfo();
    }
    if (e.target.value === "2"){
      const tip = this.state.handleData.tip;
      if (tip){
        Taro.atMessage({
          'message': tip,
          'type': 'info'
        });
      }
    }
  }
  // 选择照片
  selectImg=()=>{

    this.props.setValue('')
    Taro.navigateTo({
      url: '/pages/cropper/cropper',
    })
  }
  // 确认上传
  onConfirmUpload=()=>{
    const info = wx.getStorageSync('userInfo')
    const that=this
    if(this.props.counter.imgUrl){
      if (this.state.selectRadio == "1") {
        wx.showToast({
          title: '上传图片中...',
          icon: 'loading'
        })
        wx.uploadFile({
          url: base1 +'deviceapi/base_teacher/fail_reporting',
          filePath: this.props.counter.imgUrl,
          name: 'file',
          header:{
            'wechat': wx.getStorageSync('platform'),
            'sessionid': info.sessionid
          },
          formData:{
            "account": info.teacherAccount,
            "teacherId": info.teacherId,
            "schoolId": info.schoolId,
            "file": this.props.counter.imgUrl
          },
          success(res){
            wx.hideLoading()
               if (JSON.parse(res.data).code === 200){
                 that.props.setValue('')
                 wx.showToast({
                   title: JSON.parse(res.data).msg,
                   icon:'none'
                 })
              }else if (JSON.parse(res.data).code === 1008) {
              that.props.setValue('')
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/login/login'
                })
              }, 1000)
            } else{
              Taro.atMessage({
                'message': '上传图片失败！'+JSON.parse(res.data).msg,
                'type': 'error',
              })
            }
          },
          fail(error){
            wx.hideLoading()
            Taro.atMessage({
              'message': '上传图片失败！',
              'type': 'error',
            })
          },
        })
      } else if (this.state.selectRadio == "2") {
        // 检测图片
        wx.showToast({
          title: '图片检测中...',
          icon: 'loading'
        })
          wx.uploadFile({
            url: base1 + 'deviceapi/base_teacher/gz_reporting',
            filePath: this.props.counter.imgUrl,
            name: 'file',
            header: {
              'wechat': wx.getStorageSync('platform'),
              'sessionid': info.sessionid
            },
            formData: {
              "schooid": info.schoolId,
              "file": this.props.counter.imgUrl
            },
            success(res) {
              wx.hideLoading()
              if (JSON.parse(res.data).code === 200){
                that.props.setValue('')
                wx.showToast({
                  title: JSON.parse(res.data).msg,
                  icon:'none'
                })
              }else if (JSON.parse(res.data).code === 1008) {
                that.props.setValue('')
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/login/login'
                  })
                }, 1000)
              } else{
                Taro.atMessage({
                  'message': '上传图片失败！'+JSON.parse(res.data).msg,
                  'type': 'error',
                })
              }
            },
            fail(error){
              wx.hideLoading()
              Taro.atMessage({
                'message': '操作失败！'+error,
                'type': 'error',
              })
            },
          })

      }
    }else {
      Taro.atMessage({
        'message': '请选择照片',
        'type': 'info'
      });
    }
  }
  render(){
    const {selectRadio,faultinfo}=this.state
    return (
      <View className='fault'>
        <AtMessage />
        <View className='fault-sele'>
          <RadioGroup value={selectRadio}  className='fault-sele-view' onChange={this.onSelectRadio}>
            <Label className="radio">
              <Radio checked="true" value="1">{handleData.fault_upload||'故障点'}</Radio>
            </Label>
            <label className="radio2">
              <Radio value="2" color="#e4373c">{handleData.equip_qua||'合格证'}</Radio>
            </label>
          </RadioGroup>
        </View>

        <View className='fault-img'>
          <Text className='fault-img-text'>选择照片</Text>
          <View className='fault-img-img'>
            {
              this.props.counter.imgUrl&& <CoverImage  className='updateImg' src={this.props.counter.imgUrl}></CoverImage>
            }
          </View>
        </View>

        <View className='imgbtn'>
          <Button onClick={this.selectImg} class='imgbtn1 btn1' >选择照片 </Button>
          <Button disabled={!this.props.counter.imgUrl} onClick={this.onConfirmUpload} hover-stay-time="180" hover-class="hover" className={ClassNames('base_hover imgbtn1',this.props.counter.imgUrl  ? "btn1" : "bnt2")} >确认上传</Button>
        </View>
        {
          faultinfo?<View class='infos'>
            <View className='info-text'>{handleData.report_per||'上报人'}： {faultinfo.name}</View>
            <View className='info-text'>{handleData.accounts||'帐号'}： {faultinfo.account}</View>
            <View className='info-text'>{handleData.school||'学校'}： {faultinfo.schoolname}</View>
          </View>:null
        }


      </View>
    )
  }
}
export default Breakdown
