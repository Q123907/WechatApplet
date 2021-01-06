const {
  wxml,
  style
} = require('./demo.js')
import Authorization from './method'
const getSystemInfoSync = wx.getSystemInfoSync()
console.log('getSystemInfoSync', getSystemInfoSync)
Page({
  data: {
    src: '',
    imgObj: {
      'aroma': 'https://containeruatstorage.blob.core.chinacloudapi.cn/remy/images/aroma2.png', //香气大师
      'time': 'https://containeruatstorage.blob.core.chinacloudapi.cn/remy/images/time1.png', //风土大师
      'localCustoms': 'https://containeruatstorage.blob.core.chinacloudapi.cn/remy/images/localCustoms1.png', //时光大师
    },
    imgObjX: {
      'aroma': 'https://containeruatstorage.blob.core.chinacloudapi.cn/remy/images/aroma1.png', //香气大师
      'time': 'https://containeruatstorage.blob.core.chinacloudapi.cn/remy/images/time.png', //风土大师
      'localCustoms': 'https://containeruatstorage.blob.core.chinacloudapi.cn/remy/images/localCustoms.png', //时光大师
    },
    pageType: 'aroma', //页面类型 aroma/time/localCustoms
    userInfo: {
      pic: 'https://containeruatstorage.blob.core.chinacloudapi.cn/remy/images/pic.png',
      date: '2021/01/09',
      number: 'NO.3838292737',
      name: '哈哈哈'
    },
  },
  onLoad(options) {
    options.pageType = 'aroma'
    this.widget = this.selectComponent('.widget');
    console.log('this.widget', this.widget)
    const {
      imgObjX,
      imgObj
    } = this.data
    let showImgObj = imgObj
    if (getSystemInfoSync.screenHeight > 700) {
      showImgObj = imgObjX
    }
    if (!options.pageType) {
      wx.showToast({
        title: '缺少参数',
        icon: 'none'
      })
      return
    }
    this.setData({
      pageType: options.pageType,
      showImgObj
    })
    this.data.authorizationObj = new Authorization({
      method: "saveImageToPhotosAlbum"
    })
  },
  onReady() {
    // setTimeout(() => {
    //   this.setSrc()
    // }, 500)
  },
  async saveImg() {
    wx.showLoading({
      title: '保存中',
      mask: true,
    })
    let src = await this.setSrc().catch(err => {
      console.log('图片下载失败', err)
    })
    if (!src) {
      wx.showToast({
        title: '图片下载失败',
        icon: 'none'
      })
      return
    }
    const res = await this.data.authorizationObj.runModal({
      //是否立刻执行方法 默认为true 为fasle会调用获取授权方法提前授权无授权数据返回
      immediately: true,
      //首次拒绝授权后立即提示授权设置授权信息进入授权页
      cancelShowModal: false,
      //调用时传入的数据
      reqData: {
        filePath: src
      },
    }).catch(err => {
      console.log('错误了', err)
    })
    wx.showToast({
      title: !res ? '图片保存失败' : '保存成功',
      icon: 'none'
    })

    console.log('res', res)
  },
  setSrc() {
    if (this.data.srcPromise) return this.data.srcPromise
    const fn = async () => {
      // this.widget = this.selectComponent('.widget');
      // console.log('this.widget', this.widget)
      if (!this.widget) {
        this.data.srcPromise = null
        return
      }
     let renderToCanvas= await this.renderToCanvas().catch(err => {
        this.data.srcPromise = null
        console.log('renderToCanvas', err)
      });
      console.log('renderToCanvas',renderToCanvas)
      let data = await this.extraImage()
        .catch(err => {
          this.data.srcPromise = null
          console.log('extraImage', renderToCanvas)
        });
      return data
    }
    return this.data.srcPromise = fn()
  },
  async renderToCanvas() {
    let {
      userInfo,
      pageType,
      imgObj
    } = this.data
    const p1 = await this.widget.renderToCanvas({
      wxml: wxml({
        ...userInfo,
        bg: imgObj[pageType]
      }),
      style
    })

  },
  async extraImage() {
    const p2 = await this.widget.canvasToTempFilePath()
    console.log('p2', p2)
    return p2.tempFilePath
  }
})