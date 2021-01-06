//封装异步api
export const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}
//授权列表
export const scopeList = {
  getUserInfo: 'scope.userInfo',
  getLocation: 'scope.userLocation',
  chooseLocation: 'scope.userLocation',
  startLocationUpdateBackground: 'scope.userLocationBackground',
  chooseAddress: 'scope.address',
  chooseInvoiceTitle: 'scope.invoiceTitle',
  chooseInvoice: 'scope.invoice',
  getWeRunData: 'scope.werun',
  startRecord: 'scope.invoice',
  saveImageToPhotosAlbum: 'scope.writePhotosAlbum',
  saveVideoToPhotosAlbum: 'scope.writePhotosAlbum',
  camera: 'scope.camera',
}
//默认授权提示弹窗
export const modalObjInfo = {
  getUserInfo: '用户信息',
  getLocation: '地理位置',
  chooseLocation: '地理位置',
  startLocationUpdateBackground: '地理位置',
  chooseAddress: '地址', //已取消授权，可以直接调用对应接口
  chooseInvoiceTitle: '发票抬头', //已取消授权，可以直接调用对应接口
  chooseInvoice: '发票', //已取消授权，可以直接调用对应接口
  getWeRunData: '微信运动步数',
  startRecord: '录音功能',
  saveImageToPhotosAlbum: '保存到相册',
  saveVideoToPhotosAlbum: '保存到相册',
  camera: '摄像头',
}