const app = getApp()
import Authorization from '../components/openSetting/method'
Page({
  data: {

  },
  async onLoad() {
    let authorizationObj = new Authorization({
      method: "startLocationUpdateBackground",
    })
    const res = await authorizationObj.runModal({
      promise: false,
      immediately: false,
      showModal: false,
      immediatelyShowModal: false,
    })
    console.log('res获取结果', res)
  },
  addAddress(data) {
    console.log('获取到的数据', data)
  },
})