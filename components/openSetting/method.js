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
   *     let authorizationObj = new Authorization({
            method:"camera", //调用的方法
          })
          authorizationObj.runModal({
            doneCallback: (data) => { //回调函数
              console.log('返回的数据',data)
            },
            promise:false, //是否返回promise
            immediately:true, //是否立刻执行
            showModal:true, //是否弹窗提示
            immediatelyShowModal:false, //取消授权后是否立即执行
            modalObj:{ //默认弹窗提示
              title: '添加收货地址哈哈哈',
              content: '是否允许小程序使用您的地址信息',
            }
          })
   */
  import {
    wxPromisify,
    scopeList
  } from './wxInterface.js'
  const backfun = function (doneCallback, promise) {
    return function (data) {
      if (promise) {
        doneCallback({
          promise: data
        })
        return
      }
      data.then(res => {
        doneCallback({
          data: res
        })
      })
    }
  }
  export default class Authorization {
    constructor({
      method,
      reqData = {} //立刻执行时调用参数
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
      this.reqData = reqData //执行微信方法时入参
    }

    //执行方法
    async runModal({
      //回调函数
      doneCallback,
      //是否显示弹窗
      showModal = false,
      //显示弹窗内容
      modalObj = {
        title: '获取授权',
        content: '是否允许小程序使用您的地址信息',
      },
      //是否立刻执行方法 默认为true 为fasle会调用获取授权方法提前授权无授权数据返回
      immediately = false,
      immediatelyShowModal = false,
      // 为false返回成功后的结果，true返回一个promise对象可以自行处理授权失败提示（需要注意openSetting授权返回和授权窗口返回的数据不同）
      promise = false
    }) {
      if (this.method == 'camera' && immediately) {
        console.warn('openSetting组件：camera暂不支持离职执行将为你转为获取授权')
        immediately = false
      }
      if (this.method == 'startLocationUpdateBackground') {
        console.warn('与其它类型授权不同的是，scope.userLocationBackground 不会弹窗提醒用户。需要用户在设置页中，主动将“位置信息”选项设置为“使用小程序期间和离开小程序后”。开发者可以通过调用wx.openSetting，打开设置页')
        this.openSetting = true
      }
      let callback = backfun(doneCallback, promise)
      let promiseObj = ""
      //判断是否获取授权
      const hasSetting = await this.getSetting()
      console.log('hasSetting', hasSetting)
      if (hasSetting === false || this.openSetting) {
        //需要弹窗
        if (showModal) {
          const modalInfo = await this.hasModal(modalObj)
          if (!modalInfo.confirm) return modalInfo
        }
        const wxOpenSetting = await this.wxOpenSetting()
        console.log('wxOpenSetting111', wxOpenSetting)
        if (wxOpenSetting == 'user TAP') {
          arguments[0].showModal = true
          console.log(arguments[0])
          return await this.runModal({
            ...arguments[0]
          })
        }
        return wxOpenSetting && immediately ? this.getWxMethod() : Promise.resolve()
      } else {
        return immediately ? this.getWxMethod() : this.getAuthorize()
      }
      return
      this.getSetting().then(res => {
        //拒绝授权
        if (res === false) {
          if (showModal) { //判断是否需要调用提示框
            this.wxShowModal(modalObj).then(modal => {
              if (modal.confirm) { //用户点击确认
                this.runWxOpenSetting(callback, immediately)
              } else {
                callback(Promise.reject('取消授权'))
              }
            })
          } else {
            this.runWxOpenSetting(callback, immediately)
          }
        } else {
          promiseObj = immediately ? this.getWxMethod() : this.getAuthorize()
          promiseObj.then(res => {
            callback(promiseObj)
            callback = null
          }).catch(err => {
            //拒绝授权调用
            if (err.errMsg.includes('fail auth')) {
              if (immediatelyShowModal) { //根据条件判断拒绝授权后是否弹窗提示用户
                this.wxShowModal(modalObj).then(modal => {
                  if (modal.confirm) { //用户点击确认
                    this.runWxOpenSetting(callback, immediately)
                  } else {
                    callback(Promise.reject('取消授权'))
                  }
                })
                return
              }
            }
            callback(promiseObj)
            callback = null
          })
        }
      })
    }
    //调用设置
    // async runWxOpenSetting(callback, immediately) {
    //   await 
    //   this.wxOpenSetting().then(res => {
    //     //判断是否立即执行
    //     callback(immediately ? this.getWxMethod() : Promise.resolve(res))
    //   }).catch(err => {
    //     console.log('err', err)
    //     callback(Promise.reject('设置授权页未授权'))
    //   })
    // }
    //有弹窗时调用
    async hasModal(modalObj = {}) {
      const modal = await this.wxShowModal(modalObj)
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
      const res = await wxPromisify(wx.getSetting)().catch(err => {})
      console.log('res', res, authorization)
      this.loading = false
      return res && res.authSetting[authorization]
    }
    //调用提示框
    wxShowModal(modalObj = {

    }) {
      return wxPromisify(wx.showModal)(modalObj)
    }
    //调起客户端小程序设置界面，返回用户设置的操作结果  当用户授权时返回成功
    //参数 authorization 授权值
    async wxOpenSetting(authorization = this.authorization) {
      const openSetting = await wxPromisify(wx.openSetting)().catch(err => {
        if (err.errMsg.includes('user TAP')) {
          return 'user TAP'
        }
      })
      console.log('吊起用户界面', openSetting)
      if (openSetting == 'user TAP') return 'user TAP'
      return openSetting && openSetting.authSetting && openSetting.authSetting[authorization]
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
    getWxMethod(method = this.method, reqData = this.reqData) {
      return wxPromisify(wx[method])(reqData)
    }
  }