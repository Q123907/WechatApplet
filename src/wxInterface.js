// 封装异步api
export const wxPromisify = (fn) => function (obj = {}) {
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
// 授权列表
export const scopeList = {
  // getUserInfo: 'scope.userInfo',
  'scope.userLocation': {
    list: ['getLocation', 'chooseLocation', 'startLocationUpdate'],
    title: '地理位置'
  },
  'scope.userLocationBackground': {
    list: ['startLocationUpdateBackground'],
    title: '地理位置'
  },
  'scope.record': {
    list: ['startRecord', 'joinVoIPChat', 'RecorderManager'],
    title: '录音功能',
  },
  'scope.camera': {
    list: ['camera', 'createVKSession'],
    title: '摄像头',
  },
  'scope.bluetooth': {
    list: ['openBluetoothAdapter', 'createBLEPeripheralServer'],
    title: '蓝牙',
  },
  'scope.writePhotosAlbum': {
    list: ['saveImageToPhotosAlbum', 'saveVideoToPhotosAlbum'],
    title: '保存到相册',
  },
  'scope.addPhoneContact': {
    list: ['addPhoneContact'],
    title: '添加到联系人',
  },
  'scope.addPhoneCalendar': {
    list: ['addPhoneRepeatCalendar', 'addPhoneCalendar'],
    title: '添加到日历',
  },
  'scope.werun': {
    list: ['getWeRunData'],
    title: '微信运动步数',
  },
  'scope.address': {
    list: ['chooseAddress'],
    title: '地址',
  },
  'scope.invoiceTitle': {
    list: ['chooseInvoiceTitle'],
    title: '发票抬头',
  },
  'scope.invoice': {
    list: ['chooseInvoice'],
    title: '发票',
  },
}
export const apiList = Object.values(scopeList).map(elem => elem.list).flat(Infinity)
export const getAuthorization = (method) => {
  const keys = Object.keys(scopeList)
  let authorization = {}
  keys.forEach(elem => {
    if (scopeList[elem].list.includes(method)) {
      authorization = {
        ...scopeList[elem],
        key: elem
      }
    }
  })
  return authorization
}
