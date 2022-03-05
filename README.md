# WechatApplet

微信小程序开发
# 使用直接访问
- 安装 在小程序根目录中运行 1. npm install miniprogram-opensetting -S    2.点击工具 -点击构建npm
- npm 地址:[npm 地址](https://www.npmjs.com/package/miniprogram-opensetting)
- 安装参考微信小程序的npm安装教程
## 小程序组件

### 授权组件

- 处理用户授权和拒绝授权情况返回数据
- 需开启增强编译
- 需要设置 appId
- 组件内图片下载可以直接使用远程图片无需下载图片到本地在传入
- 创建参数
  | 参数   | 类型   | 取值范围                                                                                                                                                                         |
  | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | method | string | getLocation、chooseLocation、startLocationUpdateBackground、chooseAddress、chooseInvoiceTitle、getWeRunData、startRecord、saveImageToPhotosAlbum、saveVideoToPhotosAlbum、camera |
- 传入参数
  | 参数            | 类型    | 默认值 | 备注                                                                                                    |
  | --------------- | ------- | ------ | ------------------------------------------------------------------------------------------------------- |
  | modalObj        | object  |        | 见下表                                                                                                  |
  | immediately     | boolean | false  | 是否立即方法(false 只获取权限不会执行)                                                                  |
  | cancelShowModal | boolean | false  | 用户第一次拒绝时立即弹窗提示需要获取权限                                                                |
  | reqData         | object  |        | 根据调用方法时需要传入的对象如保存图片到本地时(saveImageToPhotosAlbum)需要传入{filePath:https://\*\*\*} |
- modalObj 参数
  | 参数        | 类型    | 默认值                                                | 备注                                                                                                                                                                         |
  | ----------- | ------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | showModal   | boolean | false                                                 | 是否显示弹窗（用户未触发点击事件调用时会自动触发弹窗)                                                                                                                        |
  | content     | object  | title:获取授权,content:是否允许小程序使用您的\*\*\*\* | 弹窗内容配置参数与 wx.showModal 相同不过无成功失败回调                                                                                                                       |
  | customModal | object  | show: false,showFn: this.showModal                    | 自定义弹窗组件 show 设置自定义弹窗 showFn 触发自定义弹窗回调用户点击自定义弹窗后 customModalConfirmResole（确认） customModalConfirmReject（取消）需要用户在操作弹窗之后调用 |

```
  /**
   * 组件的属性列表
   * method 调用微信方法 以下为取值范围
   *
   * getUserInfo 小程序已回收，请使用头像昵称填写或wx.getUserProfile，小游戏可继续调用
   *
   * getLocation 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。开启高精度定位，接口耗时会增加，可指定 highAccuracyExpireTime 作为超时时间。
   * startLocationUpdate 开启小程序进入前台时接收位置消息
   * chooseLocation 打开地图选择位置
   * startLocationUpdateBackground 开启小程序进入前后台时均接收位置消息，需引导用户开启授权。授权以后，小程序在运行中或进入后台均可接受位置消息变化。
   * startRecord 录音功能
   * joinVoIPChat 加入 (创建) 实时语音通话，更多信息可见 实时语音指南
   * RecorderManager 全局唯一的录音管理器
   * camera 摄像头（组件只能提前授权不能立即执行）
   * createVKSession 创建 vision kit 会话对象
   * openBluetoothAdapter  初始化蓝牙模块
   * createBLEPeripheralServer 建立本地作为蓝牙低功耗外围设备的服务端，可创建多个
   * saveImageToPhotosAlbum 保存图片到系统相册。
   * saveVideoToPhotosAlbum 保存视频到系统相册。支持mp4视频格式。
   * addPhoneContact  添加手机通讯录联系人
   * addPhoneRepeatCalendar 向系统日历添加重复事件
   * addPhoneCalendar 向系统日历添加事件
   * getWeRunData 获取用户过去三十天微信运动步数。需要先调用 wx.login 接口。步数信息会在用户主动进入小程序时更新。
   * chooseAddress 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。 //微信已不需要手动授权后调用调用wx.getSetting会只返回true
   * chooseInvoiceTitle 选择用户的发票抬头。当前小程序必须关联一个公众号，且这个公众号是完成了微信认证的，才能调用 chooseInvoiceTitle。//微信已不需要手动授权后调用
   * chooseInvoice 选择用户已有的发票
   *
   *
    *
   * 引入 Authorization类例：
   *
   *
   import Authorization from 'miniprogram-opensetting/method'
   let authorizationObj = new Authorization({
      method: "getLocation",
    })
    this.data.authorizationObj = authorizationObj
    const res = await authorizationObj.runModal({
      //弹窗参数
      modalObj: {
        showModal: false, //是否显示弹窗
        //显示弹窗内容 参数wx.showModal
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
      //是否立刻执行方法 默认为true 为false会调用获取授权方法提前授权无授权数据返回
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
   使用组件例子：
     <openSetting bindtap="setModal" bindcallback="callback" id="openSetting" modalObj="{{modalObj}}" method="getLocation">
    </openSetting>
    //组件调用自定义弹窗
  customModalOpenSetting() {
    wx.showModal({
      title: '组件调用',
      success: (res) => {
        console.log('res', res)
        if (res.confirm) {
          //使用组件方法
          this.selectComponent('#openSetting').customModalConfirmResole()
        } else {
          //使用组件调用
          this.selectComponent('#openSetting').customModalConfirmReject()
        }
      },
    })
  },
*/
```

- 实例代码：[授权组件例子下载](https://developers.weixin.qq.com/s/mTJOTSml7Uq3)
- npm 地址:[npm 地址](https://www.npmjs.com/package/miniprogram-opensetting)
- github 地址:[github 地址](https://github.com/Q123907/WechatApplet/tree/master)
