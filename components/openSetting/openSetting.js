import {
  scopeList,
  wxPromisify
} from './wxInterface.js'
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
    promise: { //为false返回成功后的结果，true返回一个promise对象可以自行处理授权失败提示（需要注意openSetting授权返回和授权窗口返回的数据不同）
      type: Boolean,
      value: false
    },
    //立即调用方法时传入的数据
    reqData: {
      type: Object,
      value: {}
    },
    //拒绝授权后是否需要提示弹窗 在进入设置授权页
    showModal: {
      type: Boolean,
      value: true
    },
    //拒绝授权后立即提示授权设置授权信息进入授权页
    immediatelyShowModal: {
      type: Boolean,
      value: true
    },
    //弹窗提示信息
    modalObj: {
      type: Object,
      value: {
        title: '添加收货地址',
        content: '是否允许小程序使用您的地址信息',
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击按钮授权回调
    openSetting: function(e) {
      let {
        immediately,
        authorization
      } = this.data
      let getSettingInfo = e.authSetting
      let promise
      if (getSettingInfo[authorization] === true) { //成功后回调函数
        //立即执行
        if (immediately) {
          this.methodCall()
          return
        }
        promise = Promise.resolve('success')
      } else {
        promise = Promise.reject('err')
      }
      this.callback(promise)
    },
    //判断是否有过授权
    getSetting() {
      let {
        authorization,
        showModal,
        loading
      } = this.data
      if (loading) return
      this.data.loading = true
      // 页面被展示
      wx.getSetting({
        success: (res) => {
          if (res.authSetting[authorization] === false) {
            if (showModal) { //判断是否需要调用提示框
              this.wxShowModal()
            } else {
              this.wxOpenSetting()
            }
          } else {
            this.methodCall()
          }
          this.data.loading = false
        },
        fail: () => {
          this.data.loading = false
        }
      })
    },
    //调用提示框
    wxShowModal() {
      let {
        modalObj
      } = this.data
      wxPromisify(wx.showModal)(modalObj).then(modal => {
        if (modal.confirm) {
          this.wxOpenSetting()
        }else{
          this.callback(Promise.reject('取消授权'))
        }
      })
    },
    //调用设置授权
    wxOpenSetting() {
      wxPromisify(wx.openSetting)().then((e) => {
        this.openSetting(e)
      })
    },
    //执行调用方法
    methodCall() {
      let {
        method,
        authorization,
        immediately,
        reqData,
        immediatelyShowModal
      } = this.data
      let promise
      if (!immediately) {
        promise = wxPromisify(wx.authorize)({
          scope: authorization
        })
      } else {
        promise = wxPromisify(wx[method])(reqData)
      }
      promise.then(res => {
        this.callback(promise)
      }).catch(err => {
        //拒绝授权调用
        if (err.errMsg.includes('fail auth')) {
          if (immediatelyShowModal) { //根据条件判断拒绝授权后是否弹窗提示用户
            this.wxShowModal()
            return
          }
        }
        this.callback(promise)
      })
    },
    callback(data) {
      let {
        promise,
        immediatelyShowModal
      } = this.data
      if (promise) {
        this.triggerEvent('callback', {
          promise: data
        })
        return
      }
      data.then(res => {
        this.triggerEvent('callback', {
          data: res
        })
      })
    },
  },
  ready() {
    let {
      method,
      immediately
    } = this.data
    if (method == 'getUserInfo') {
      throw Error('openSetting组件：暂不支持getUserInfo建议 感觉单独封装getUserInfo登录组件比较好')
    }
    if (method === '') {
      throw Error(`openSetting组件：method传参不能为空`)
    }
    if (!scopeList[method]) {
      throw Error(`openSetting组件：暂无${method}方法请修改`)
    }
    if (method == 'camera' && immediately) {
      console.warn('openSetting组件：camera暂不支持离职执行将为你转为获取授权')
      this.data.immediately = false
    }
    this.data.authorization = scopeList[method]
  },
})