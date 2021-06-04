/**
 * 组件的属性列表
 * method 调用微信方法 以下为取值范围
 * 
 * getUserInfo 获取用户信息(暂不支持getUserInfo建议 感觉单独封装getUserInfo登录组件比较好)
 * 
 * getLocation 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。开启高精度定位，接口耗时会增加，可指定 highAccuracyExpireTime 作为超时时间。
 * 
 * chooseLocation 打开地图选择位置
 * startLocationUpdateBackground 开启小程序进入前后台时均接收位置消息，需引导用户开启授权。授权以后，小程序在运行中或进入后台均可接受位置消息变化。
 * chooseAddress 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。 //微信已不需要手动授权后调用
 * chooseInvoiceTitle 选择用户的发票抬头。当前小程序必须关联一个公众号，且这个公众号是完成了微信认证的，才能调用 chooseInvoiceTitle。//微信已不需要手动授权后调用
 * getWeRunData 获取用户过去三十天微信运动步数。需要先调用 wx.login 接口。步数信息会在用户主动进入小程序时更新。
 * startRecord 录音功能
 * saveImageToPhotosAlbum 保存图片到系统相册。
 * saveVideoToPhotosAlbum 保存视频到系统相册。支持mp4视频格式。
 * camera 摄像头（组件只能提前授权不能立即执行）
 * 
 * 例：
 *      
 * let authorizationObj = new Authorization({
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
        showFn: this.showModal //自定义弹窗触发回调
      }
    },
    //是否立刻执行方法 默认为true 为fasle会调用获取授权方法提前授权无授权数据返回
    immediately: false,
    //首次拒绝授权后立即提示授权设置授权信息进入授权页
    cancelShowModal: false,
    //调用时传入的数据
    reqData: {},
  })
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
 */
import {
  wxPromisify,
  scopeList,
  modalObjInfo
} from './wxInterface.js'
export default class Authorization {
  constructor({
    method,
  }) {
    if (method == 'getUserInfo') {
      throw Error('openSetting组件：暂不支持getUserInfo建议 感觉单独封装getUserInfo登录组件比较好')
    }
    if (method === '') {
      throw Error(`openSetting组件：method传参不能为空`)
    }
    if (!scopeList[method]) {
      throw Error(`openSetting组件：暂无${method}方法请修改`)
    }
    this.openSetting = false
    this.loading = false
    this.method = method //微信方法
    this.authorization = scopeList[method] //微信授权值
  }

  //执行方法
  async runModal({
    //弹窗参数
    modalObj = null,
    //是否立刻执行方法 默认为true 为fasle会调用获取授权方法提前授权无授权数据返回
    immediately = true,
    //拒绝授权后立即提示授权设置授权信息进入授权页
    cancelShowModal = false,
    //调用时传入的数据
    reqData = {},
  } = {}) {
    //初始化弹窗数据
    modalObj = this.initModalObj(modalObj)
    if (this.method == 'camera' && immediately) {
      console.warn('openSetting组件：camera暂不支持离职执行将为你转为获取授权')
      immediately = false
    }
    if (typeof reqData !== 'object') {
      console.error('reqData参数必须时对象')
    }
    if (this.method == 'startLocationUpdateBackground') {
      console.warn('与其它类型授权不同的是，scope.userLocationBackground 不会弹窗提醒用户。需要用户在设置页中，主动将“位置信息”选项设置为“使用小程序期间和离开小程序后”。开发者可以通过调用wx.openSetting，打开设置页')
      this.openSetting = true
    }
    //检查是否需要下载
    reqData = await this.downloadFile(reqData)
    //判断是否获取授权
    const hasSetting = await this.getSetting()
    if (hasSetting === false || this.openSetting) {
      //需要弹窗
      if (modalObj && modalObj.showModal) {
        const modalInfo = await this.hasModal(modalObj)
        if (!modalInfo.confirm) return Promise.reject(modalInfo)
      }
      //吊起授权页
      const wxOpenSetting = await this.wxOpenSetting()

      //用户无点击动作调用点击
      if (!wxOpenSetting.confirm && wxOpenSetting.errMsg.includes('user TAP')) {
        console.log('用户未点击自动调用点击方法')
        arguments[0].modalObj = {
          ...arguments[0].modalObj,
          showModal: true,
        }
        return await this.runModal({
          ...arguments[0]
        })
      }
      if (!wxOpenSetting.confirm) return Promise.reject(wxOpenSetting)
    }
    const promise = immediately ? this.getWxMethod({
      reqData
    }) : this.getAuthorize()
    return promise.catch(err => {
      if (cancelShowModal) {
        arguments[0].modalObj = {
          ...arguments[0].modalObj,
          showModal: true,
        }
        return this.runModal({
          ...arguments[0]
        })
      }
      return Promise.reject(err)
    })
  }
  //初始化弹窗数据
  initModalObj(modalObj) {
    let modalObjInit = {
      showModal: !!(modalObj && modalObj.showModal),
      //显示弹窗内容
      content: {
        title: '获取授权',
        content: `是否允许小程序使用您的${modalObjInfo[this.method]}`,
      },
      //是否自定义弹窗
      customModal: {
        show: false, //是否自定义组件
        showFn: () => { }, //自定义组件显示回调
      },
      ...modalObj,
    }
    return modalObjInit
  }
  //自定义弹窗
  customModal(customModal) {
    customModal.showFn()
    return new Promise((resole, reject) => {
      this.customModalConfirmResole = function () {
        resole({
          confirm: true,
        })
      }
      this.customModalConfirmReject = function () {
        resole({
          confirm: false,
        })
      }
    })
  }
  //有弹窗时调用
  async hasModal(modalObj = {}) {
    const modal = modalObj.customModal.show ? await this.customModal(modalObj.customModal) : await this.wxShowModal(modalObj.content)
    if (modal.confirm) { //用户点击确认
      return {
        confirm: true,
        msg: '弹窗点击确认',
        errMsg: 'userMoalCancle'
      }
    } else {
      return {
        confirm: false,
        msg: '弹窗取消授权用户取消',
        errMsg: 'userMoalCancle'
      }
    }
  }
  //获取是否授权
  async getSetting(authorization = this.authorization) {
    if (this.loading) return
    this.loading = true
    const res = await wxPromisify(wx.getSetting)().catch(err => { })
    this.loading = false
    return res && res.authSetting[authorization]
  }
  //调用提示框
  wxShowModal(modalObj = {}) {
    return wxPromisify(wx.showModal)(modalObj)
  }
  //调起客户端小程序设置界面，返回用户设置的操作结果  当用户授权时返回成功
  //参数 authorization 授权值
  async wxOpenSetting(authorization = this.authorization) {
    const openSetting = await wxPromisify(wx.openSetting)().catch(err => {
      if (err.errMsg.includes('user TAP')) {
        return {
          msg: '直接调用了wx.openSetting方法没有用户点击行为',
          errMsg: err.errMsg,
          confirm: false
        }
      }
      return {
        ...err,
        confirm: false,
        msg: 'wx.openSetting方法失败了'
      }
    })
    // console.log('吊起用户界面', openSetting)
    return {
      ...openSetting,
      confirm: !!(openSetting.authSetting && openSetting.authSetting[authorization]),
    }
  }
  //只获取授权,之后调用数据
  //参数 authorization 授权值
  getAuthorize(authorization = this.authorization) {
    return wxPromisify(wx.authorize)({
      scope: authorization
    })
  }
  //获取授权成功后数据
  //参数 method 微信方法 reqData请求二外参数
  getWxMethod({
    method = this.method,
    reqData = {}
  }) {
    return wxPromisify(wx[method])(reqData)
  }
  // 检查是否下载
  checkDown() {
    const { method } = this
    const downArr = ['saveImageToPhotosAlbum', 'saveVideoToPhotosAlbum']
    return downArr.includes(method)
  }
  //下载图片到本地
  downloadFile(reqData) {
    if (!reqData?.filePath || !this.checkDown()) return Promise.resolve(reqData)
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: reqData.filePath,
        success: (res) => {
          reqData.filePath = res.tempFilePath
          resolve(reqData)
        },
        fail(err) {
          reject('图片下载失败')
        }
      })
    })
  }
}