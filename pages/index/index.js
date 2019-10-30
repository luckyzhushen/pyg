// 0 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList:[],
    //导航数组
    catesList:[],
    //楼层数据
    floorList:[],

    navigator_url:""
  },

  /**
   * 生命周期函数--监听页面加载
   * 页面开始就触发
   */
  onLoad: function (options) {
    // var that = this;
    // 1 开始发送异步请求获取轮播图数据 优化手段通过es6 promise来解决这个问题
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success: function(res) {
    //     that.setData({
    //       swiperList:res.data.message
    //     })
    //   },
    //   fail: function(res) {},
    //   //成功或失败都会返回
    //   complete: function(res) {},
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  
  //获取轮播图数据
  getSwiperList(){
    request({ url: "/home/swiperdata"})
      .then(result => {

        this.setData({
          swiperList: result
        })
      });
  },
  //获取分类导航数据
  getCatesList() {
    request({
      url: "/home/catitems"})
      .then(result => {
        this.setData({
          catesList: result
        })
      });
  },
  //获取楼层数据
  getFloorList() {
    request({
      url: "/home/floordata"})
      .then(result => {
        this.setData({
          floorList: result
        })
      });
  },
  handleQuery(e){
    let navigator_url =  e.currentTarget.dataset.navigator_url.substring(30);
    console.log('/pages/goods_list/goods_list?query='+navigator_url);
    
    wx.navigateTo({
      url: '/pages/goods_list/goods_list?query='+navigator_url
    })
  }
  
})