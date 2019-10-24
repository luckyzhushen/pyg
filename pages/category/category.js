// 0 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取分类数组
    categoryList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getCategoryList();
  },

  //获取分类数据
  getCategoryList() {
    request({ url: "https://api.zbztb.cn/api/public/v1/categories"})
      .then(result => {
      this.setData({
        categoryList: result.data.message
      })
    });
  },

})