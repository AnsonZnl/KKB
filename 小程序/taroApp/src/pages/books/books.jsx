/* eslint-disable react/sort-comp */
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text , Navigator} from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

const db = wx.cloud.database();
import './books.scss'


@inject('counterStore')
@observer
class Books extends Component {

  config = {
    navigationBarTitleText: '首页',
    enablepullDownRefresh: true
  }
  constructor(props){
    super(props)
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      booksList: []
    }
  }
  onPullDownRefresh(){
    this.componentWillMount()
  }
  componentWillMount () {
    db.collection('doubanbooks').get().then(res=>{
      console.log(res);
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        booksList: res.data
      })
    }).catch(err=>{
      console.log(err)
    })
  }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  increment = () => {
    const { counterStore } = this.props
    counterStore.increment()
  }

  decrement = () => {
    const { counterStore } = this.props
    counterStore.decrement()
  }

  incrementAsync = () => {
    const { counterStore } = this.props
    counterStore.incrementAsync()
  }

  render () {
    const { counterStore: { counter } } = this.props
    return (
      <View>
        <Text>book</Text>
      {
      this.state.booksList.map((item,index)=>{
        return <View>{item.title}</View>
      })
      }</View>
    )
  }
}

export default Books
