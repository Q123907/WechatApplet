const app = getApp()
import Authorization from '../components/openSetting/method'
Page({
  data: {

  },
  onLoad: function () {
    let authorizationObj = new Authorization({
      method:"chooseAddress",
    })
    authorizationObj.runModal({
      doneCallback: (data) => {
        console.log('返回的数据',data)
      },
      promise:false,
      immediately:true,
      showModal:true,
      immediatelyShowModal:false,
      modalObj:{
        title: '添加收货地址哈哈哈',
        content: '是否允许小程序使用您的地址信息',
      }
    })
  },
  addAddress(data) {
    console.log('获取到的数据', data)
  },
})