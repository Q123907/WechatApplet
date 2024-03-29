/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import Authorization from '../../components/method'

Page({
  data: {
    modalObj: {
      showModal: true, // 是否显示弹窗
      // 显示弹窗内容 参数参考wx.showModal
      content: {
        title: '获取授权',
        content: '是否允许小程序使用您的地理权限',
      },
      // 自定义弹窗
      customModal: {
        show: false, // 显示自定义弹窗
        showFn: () => {}, // 自定义弹窗触发回调
      },
    },
    reqData: {
      filePath:
        'https://fc1tn.baidu.com/it/u=1189779147,4248115718&fm=202&mola=new&crop=v1',
    },
    addPhoneRepeatCalendarData: {
      title: '测试',
      startTime: new Date().getTime()
    }
  },
  async onLoad() {
    // 本地调用
    this.createAuthorization()
  },
  // 本地调用方法
  createAuthorization() {
    // 本地调用
    const authorizationObj = new Authorization({
      method: 'addPhoneRepeatCalendar',
    })
    this.data.authorizationObj = authorizationObj
    this.authorization()
  },
  // 创建组件
  async authorization() {
    const {authorizationObj, addPhoneRepeatCalendarData} = this.data
    const res = await authorizationObj.runModal({
      cancelShowModal: false,
      addPhoneRepeatCalendarData
    }).catch((err) => {
      console.log(err)
    })

    console.log('res获取结果', res)
  },

  // 组件回调
  callback(data) {
    console.log('组件返回的数据获取到的数据', data.detail)
  },
  // 自定义弹窗
  customModal() {
    wx.showModal({
      title: '直接调用方法',
      success: (res) => {
        console.log('res', res)
        if (res.confirm) {
          // 成功时调用
          this.data.authorizationObj.customModalConfirmResole()
        } else {
          // 失败是调用
          this.data.authorizationObj.customModalConfirmReject()
        }
      },
    })
  },
  setModal() {
    this.setData({
      'modalObj.customModal.showFn': this.customModalOpenSetting,
      'modalObj.customModal.show': true,
    })
  },
  // 组件调用自定义弹窗
  customModalOpenSetting() {
    wx.showModal({
      title: '组件调用',
      success: (res) => {
        console.log('res组件调用', res)
        if (res.confirm) {
          // 使用组件方法
          this.selectComponent('#openSetting').customModalConfirmResole()
        } else {
          // 使用组件调用
          this.selectComponent('#openSetting').customModalConfirmReject()
        }
      },
    })
  },
})
