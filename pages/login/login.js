// import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  // 获取用户信息
  bandleGetUserInfo(e){
      // 1 获取用户信息
      const {userInfo}=e.detail; 
      wx.setStorageSync('userinfo', userInfo);
      wx.navigateBack({
        delta: 1
      }); 
  }
})