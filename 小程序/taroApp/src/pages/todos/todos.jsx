/* eslint-disable react/sort-comp */
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text , Navigator} from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'



@inject('counterStore')
@observer
class Todos extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props){
    super(props)
    this.state = {
      list: ['吃饭', '睡觉', '学习'],
      inpVal: ''
    }
  }

  render () {
    const { counterStore: { counter } } = this.props;
    let {list, inpVal} = this.state;
    return (
      <View className='todos'>
        <Navigator url='/pages/index/index'>Index</Navigator>
        <View>Todos</View>
           {
            list.map((item,index)=>{
            return <Text>{index+1}-{item}</Text>
           })
          }
      </View>
    )
  }
}

export default Todos
