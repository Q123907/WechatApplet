const app = getApp()
import Authorization from '../components/openSetting/method'
Page({
  data: {},
  async onLoad() {
    let authorizationObj = new Authorization({
      method: "getLocation",
    })
    this.data.authorizationObj = authorizationObj
    const res = await authorizationObj.runModal({
      //弹窗参数
      modalObj: {
        showModal: false, //是否显示弹窗
        //显示弹窗内容 参数参考wxwx.showModal
        content: {
          title: '获取授权',
          content: `是否允许小程序使用您的地理权限哈哈哈`,
        },
        //自定义弹窗
        customModal: {
          show: false, //显示自定义弹窗
          showFn: this.customModal //自定义弹窗触发回调
        }
      },
      //是否立刻执行方法 默认为true 为fasle会调用获取授权方法提前授权无授权数据返回
      immediately: false,
      //首次拒绝授权后立即提示授权设置授权信息进入授权页
      cancelShowModal: false,
      //调用时传入的数据
      reqData: {},
    })
    console.log('res获取结果', res)
  },
  addAddress(data) {
    console.log('获取到的数据', data)
  },
  //自定义弹窗
  customModal() {
    wx.showModal({
      title: '哈哈哈',
      success: (res) => {
        console.log('res', res)
        if (res.confirm) {
          //成功时调用
          this.data.authorizationObj.customModalConfirmResole()
        } else {
          //失败是调用
          this.data.authorizationObj.customModalConfirmReject()
        }
      },
    })
  },
})