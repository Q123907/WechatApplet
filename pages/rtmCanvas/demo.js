const wxml = function (data) {
 return `
<view class="main">
  <image src="${data.bg}" mode="widthFix" class="bg"></image>
  <image src="${data.pic}" class="pic"></image>
  <view class="name">
    <text class="font16">${data.name}</text>
  </view>
  <view class="date">
   <text class="font12">${data.date}</text>
   </view>
  <view class="number"> <text class="font12">${data.number}</text></view>
</view>
`
}
const style = {
  main: {
    width: 1125,
    height: 1989,
  },

  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1125,
    height: 1986,
  },

  pic: {
    width: 279,
    height: 279,
    borderRadius: 139.5,
    left: 424,
    top: 507,
    position: "absolute",
  },
  font16: {
    width: 525,
    height: 48,
    lineHeight: 48,
    fontSize: 48,
    textAlign: 'center',
    fontWeight: 800
  },
  name: {
    width: 525,
    height: 48,
    position: "absolute",
    left: 300,
    top: 845,
    fontSize: 48,
    textAlign: "center",
    fontWeight: "bold",
  },

  date: {
    width: 900,
    position: "absolute",
    left: 189,
    top: 1464,
    fontSize: 36,
  },
  font12: {
    fontSize: 36,
    width: 900,
    height: 36,
    lineHeight: 36,
    textAlign: 'left',
  },
  number: {
    width: 900,
    height: 36,
    position: "absolute",
    left: 189,
    top: 1515,
    fontSize: 36,
  },
}

module.exports = {
  wxml,
  style
}