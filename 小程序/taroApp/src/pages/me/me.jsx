/* eslint-disable react/sort-comp */
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text , Navigator} from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

const db = wx.cloud.database();
import './me.scss'
@inject('counterStore')
@observer
class Me extends Component {

  config = {
    navigationBarTitleText: '我的'
  }

  constructor(props){
    super(props)
    this.state = {
      userInfo: Taro.getStorageSync('userInfo') || {}
    }
  }
  onGetUserInfo(e){
    const userInfo = e.detail.userInfo;
    wx.cloud.callFunction({
      name: 'login',
      success:res=>{
         console.log(res)
         userInfo.openid = res.result.openid;
         this.setState({
           userInfo
         })
         Taro.setStorageSync('userInfo', userInfo)
         console.log(userInfo)
      }
    })
  }

  scanCode(){
    Taro.scanCode({
      success:res=>{
        console.log(res)
        let isbn = res.result;
        wx.cloud.callFunction({
          name: 'getBookInfo',
          data:{
            isbn
          },
          success:res2=>{
            console.log(res2)
            if(res2.result){
              db.collection('doubanbooks')
              .add({
                data: res2.result
              })
              .then(res3=>{
                console.log(res3);
                if(res3._id){
                  Taro.showToast({
                    title: '添加成功！',
                    icon:'none'
                  })
                }
              })
              .catch(err3=>{
                console.log(err3)
              })
            }
          },
          fail:err=>{
            console.log(err)
          }
        })
      }
    })
  }

  render () {
    const { counterStore: { counter } } = this.props;
    let {userInfo} = this.state;
    return (
      <View className=''>
        {/* <Navigator url='/pages/index/index'>Index</Navigator> */}
        <View className='mb20'>{userInfo.openid ? `Hi~ ${userInfo.nickName}` : '未登录'}</View>
        {
        userInfo.openid ?
        <Button onClick={this.scanCode}>扫码</Button> :
        <Button onGetUserInfo ={this.onGetUserInfo} openType='getUserInfo'>登陆</Button>
        }
      </View>
    )
  }
}

export default Me
