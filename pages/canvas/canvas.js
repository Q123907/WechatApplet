import Card from './palette/card';
import Authorization from './method'
// src/pages/xml2can/xml2can.js
const getSystemInfoSync = wx.getSystemInfoSync()
Page({
  imagePath: '',
  history: [],
  future: [],
  isSave: false,

  /**
   * 页面的初始数据
   */
  data: {
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
  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      image: this.imagePath
    })
    if (this.isSave) {
      this.saveImage(this.imagePath);
    }
  },
  async saveImage() {
    if (this.imagePath && typeof this.imagePath === 'string') {
      wx.showLoading({
        title: '保存中',
        mask: true,
      })
      const res = await this.data.authorizationObj.runModal({
        //是否立刻执行方法 默认为true 为fasle会调用获取授权方法提前授权无授权数据返回
        immediately: true,
        //首次拒绝授权后立即提示授权设置授权信息进入授权页
        cancelShowModal: false,
        //调用时传入的数据
        reqData: {
          filePath: this.imagePath
        },
      }).catch(err => {
        console.log('错误了', err)
      })
      wx.showToast({
        title: !res ? '图片保存失败' : '保存成功',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let {
      userInfo,
      pageType,
      imgObj
    } = this.data
    this.setData({
      paintPallette: new Card({
        ...userInfo,
        bg: imgObj[pageType]
      }).palette(),
    });
  },
});