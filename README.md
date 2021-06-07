# WechatApplet

微信小程序开发

## 小程序组件

### 授权组件

- 处理用户授权和拒绝授权情况返回数据
- 需开启增强编译
- 需要设置 appId
- 接收参数
- 创建参数
  |  参数   | 类型  |取值范围|
  |  ----  | ----  | ---- |
  | method  | srting | getLocation、chooseLocation、startLocationUpdateBackground、chooseAddress、chooseInvoiceTitle、getWeRunData、startRecord、saveImageToPhotosAlbum、saveVideoToPhotosAlbum、camera|
- 传入参数
    |  参数   | 类型 | 默认值 |备注|
  |  ----  | ----  | ---- | ---- |
  | modalObj  | object |  | 见下表
  | immediately | boolean | false | 是否立即方法(false只获取权限不会执行)
  | cancelShowModal | boolean | false | 用户第一次拒绝时立即弹窗提示需要获取权限
  | reqData | object | |根据调用方法时需要传入的对象如保存图片到本地时(saveImageToPhotosAlbum)需要传入{filePath:https://***} |
- modalObj参数
  |参数|类型|默认值| 备注|
  |  ----  | ----  | ---- | ---- |
  |showModal|boolean|false|是否显示弹窗（用户未触发点击事件调用时会自动触发弹窗)|
  |content|object|title:获取授权,content:是否允许小程序使用您的**** | 弹窗内容配置参数与wx.showModal相同不过无成功失败回调|
  |customModal|object|show: false,showFn: this.showModal |自定义弹窗组件show设置自定义弹窗showFn触发自定义弹窗回调用户点击自定义弹窗后customModalConfirmResole（确认） customModalConfirmReject（取消）需要用户在操作弹窗之后调用|
          
```
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
   * chooseAddress 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。 //微信已不需要手动授权后调用调用wx.getSetting会只返回true
   * chooseInvoiceTitle 选择用户的发票抬头。当前小程序必须关联一个公众号，且这个公众号是完成了微信认证的，才能调用 chooseInvoiceTitle。//微信已不需要手动授权后调用
   * getWeRunData 获取用户过去三十天微信运动步数。需要先调用 wx.login 接口。步数信息会在用户主动进入小程序时更新。
   * startRecord 录音功能
   * saveImageToPhotosAlbum 保存图片到系统相册。
   * saveVideoToPhotosAlbum 保存视频到系统相册。支持mp4视频格式。
   * camera 摄像头（组件只能提前授权不能立即执行）
   *
   *
*/
```

实例代码：[授权组件例子下载](https://developers.weixin.qq.com/s/mGlz6rmO7Te6)
