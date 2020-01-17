# WechatApplet
微信小程序开发
## 小程序组件
### 授权组件
#### 样式问题暂不支持 app.json 中配置 "style": "v2"可表明启用新版的组件样式（使用新版组件样式butoon样式需要单独配置）在wxss文件中添加
#### 需要设置appId
#### 接收参数
```
  properties: {
    method: { //调用的方法(必传)
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
    reqData:{
      type: Object,
      value: {}
    },
  },
    /**
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
```
实例代码：[授权组件例子下载](https://developers.weixin.qq.com/s/mGlz6rmO7Te6)
