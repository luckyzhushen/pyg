import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import { login } from "../../utils/asyncWx.js";
Page({
  // 获取用户信息
  async bandleGetUserInfo(e){
    try {
      // 1 获取用户信息 signature iv rawData encryptedData
      const {encryptedData,rawData,iv,signature}=e.detail;
      // 2 获取小程序登录成功后的code
      const {code} = await login();
      const loginParams={encryptedData,rawData,iv,signature,code};
      // 3 发送请求 获取用户token值
      const {token} = await request({url:"/users/wxlogin",data:loginParams,method:"post"});
      // 4 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      });
    } catch (error) {
      console.log(error); 
    }
  }
})