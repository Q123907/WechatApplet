const wxml = function (data) {
  return `
 <view class="main">
   <image src="${data.bg}"  class="bg"></image>
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
     width: 750,
     height: 1326,
   },
 
   bg: {
     position: "absolute",
     top: 0,
     left: 0,
     width: 750,
     height: 1326,
   },
 
   pic: {
     width: 185,
     height: 185,
     borderRadius: 92.5,
     left: 283,
     top: 338,
     position: "absolute",
   },
   font16: {
     width: 351,
     height: 32,
     lineHeight: 32,
     fontSize: 32,
     textAlign: 'center',
     fontWeight: 800
   },
   name: {
     width: 351,
     height: 32,
     position: "absolute",
     left: 200,
     top: 563,
     fontSize: 32,
     textAlign: "center",
     fontWeight: "bold",
   },
 
   date: {
     width: 500,
     height:24,
     position: "absolute",
     left: 125,
     top: 977,
     fontSize: 24,
   },
   font12: {
     fontSize: 24,
     width: 500,
     height: 24,
     lineHeight: 24,
     textAlign: 'left',
   },
   number: {
     width: 500,
     height: 24,
     position: "absolute",
     left: 125,
     top: 1000,
     fontSize: 24,
   },
 }
 
 module.exports = {
   wxml,
   style
 }