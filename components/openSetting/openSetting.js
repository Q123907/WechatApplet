import Authorization from './method'
Component({
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
   * chooseAddress 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
   * chooseInvoiceTitle 选择用户的发票抬头。当前小程序必须关联一个公众号，且这个公众号是完成了微信认证的，才能调用 chooseInvoiceTitle。
   * getWeRunData 获取用户过去三十天微信运动步数。需要先调用 wx.login 接口。步数信息会在用户主动进入小程序时更新。
   * startRecord 录音功能
   * saveImageToPhotosAlbum 保存图片到系统相册。
   * saveVideoToPhotosAlbum 保存视频到系统相册。支持mp4视频格式。
   * camera 摄像头（组件只能提前授权不能立即执行）
   * 
   * 例：
   * <view style="position:relative">
   *    <openSetting  bindcallback="addAddress" method="chooseAddress"></openSetting>
   * </view>
   * 
   */

  properties: {
    method: { //调用的方法
      type: String,
      value: ""
    },
    immediately: { //是否立刻执行方法 默认为true 为fasle会调用获取授权方法提前授权无授权数据返回
      type: Boolean,
      value: true
    },
    //立即调用方法时传入的数据
    reqData: {
      type: Object,
      value: {}
    },
    //拒绝授权后是否需要提示弹窗 在进入设置授权页
    showModal: {
      type: Boolean,
      value: false
    },
    //拒绝授权后立即提示授权设置授权信息进入授权页
    cancelShowModal: {
      type: Boolean,
      value: true
    },
    //弹窗提示信息
    modalObj: {
      type: Object,
      value: {
        showModal: false, //是否显示弹窗
        //显示弹窗内容 参数参考wxwx.showModal
        content: {
          title: '获取授权',
          content: `是否允许小程序使用您的地理权限哈哈哈`,
        },
        //自定义弹窗
        customModal: {
          show: false, //显示自定义弹窗
          showFn: () => {} //自定义弹窗触发回调
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    authorizationObj: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //调用授权方法
    async getSetting() {
      this.createAuthorization()
      let {
        immediately,
        showModal,
        cancelShowModal,
        modalObj,
        authorizationObj
      } = this.data
      let res = await authorizationObj.runModal({
        immediately,
        showModal,
        cancelShowModal,
        modalObj
      })
      console.log('res获取到的结果', res.detail)
      this.triggerEvent('callback', res)
    },
    //自定义组件授权确认调用
    customModalConfirmResole() {
      this.data.authorizationObj.customModalConfirmResole()
    },
    //自定义组件点击取消调用
    customModalConfirmReject() {
      this.data.authorizationObj.customModalConfirmReject()
    },
    //创建授权
    createAuthorization() {
      let {
        authorizationObj,
        method
      } = this.data
      if (authorizationObj) return
      this.data.authorizationObj = new Authorization({
        method,
      })
    }
  },
  ready() {
    this.createAuthorization()
  },

})