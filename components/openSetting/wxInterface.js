

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
export const scopeList={
  getUserInfo:'scope.userInfo',
  getLocation:'scope.userLocation',
  chooseLocation:'scope.userLocation',
  startLocationUpdateBackground:'scope.userLocationBackground',
  chooseAddress: 'scope.address',
  chooseInvoiceTitle:'scope.invoiceTitle',
  chooseInvoice:'scope.invoice',
  getWeRunData:'scope.werun',
  startRecord:'scope.invoice',
  saveImageToPhotosAlbum:'scope.writePhotosAlbum',
  saveVideoToPhotosAlbum:'scope.writePhotosAlbum',
  camera:'scope.camera',
}
