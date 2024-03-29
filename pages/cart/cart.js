import { getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    // 总价格
    totalPrice:0,
    // 总数量
    totalNum:0
  },

  // 点击 收货地址
  /**
   * 1 获取用户的收货地址功能
   *  1 绑定点击事件
   *  2 调用小程序内置API 获取用户的收货地址(简单，但实际不可用)
   *  2 获取用户 对小程序所授予获取地址的 权限 状态scope 
   *    1 假设用户点击获取收货地址的提示框 确定 authSetting scope.address
   *      scope 值 true   直接调用收货地址
   *    2 假设用户从来没有调用过 收货地址的API 。
   *      scope undefind  直接调用收货地址
   *    3 假设 用户 点击获取收货地址的提示框 取消。
   *      scope false 
   *         1 诱导用户自己打开授权设置页面 当用户重新给获取地址权限时
   *         2 获取收货地址
   *    4 把获取到的收货地址 存入到本地存储中
   * 2 页面加载完毕
   *  0 onLoad onShow
   *  1 获取本地存储中的地址数据
   *  2 把数据设置给data中的一个变量
   * 3 onShow
   *  0 回到商品详情页面 第一次添加商品时  添加属性checked=true
   *    1 num=1;
   *    2 checked=true;
   *  1 获取缓存中的购物车数组
   *  2 把购物车数据填充到data中
   * 4 全选的实现 
   *  1 onShow 获取缓存购物车数组
   *  2 根据购物车中的商品数据进行计算 所有商品都被选中 checked=true 
   * 5 总价格和总数量
   *  1 商品被选中 才计算价格
   *  2 获取购物车数组
   *  3 遍历
   *  4 判断商品是否被选中
   *  5 总价格 += 商品单价*商品数量
   *  6 总数量 +=商品的数量
   *  7 把计算后的价格和数量 设置回data中
   * 6 商品的选中
   *  1 绑定change事件
   *  2 获取到被修改的商品对象
   *  3 商品对象的选中状态 取反
   *  4 重新填充会data中和缓存中
   *  5 重新计算全选 总价格 总数量
   *7 全选和反选
   *  1 全选复选框绑定时间 change
   *  2 获取data中的全选变量allChecked
   *  3 直接取反
   *  4 遍历购物车数组 让里边的购物车商品选中状态都跟随着allChecked改变而改变
   *  5 把购物车数组和allChecked重新设置回data中 把购物车设置回缓存中
   * 8 商品数量的编辑
   *  1 "+""-"按钮 绑定同一个点击事件 区分的关键 自定义属性
   *    1 "+" "+"
   *    2 "-" "-"
   *  2 传递被点击的商品id goods_id
   *  3 获取到data中的购物车数组 来获取需要被修改的商品对象
   *  4 当购物车的数量=1 同事用户点击 "-" 
   *    弹出提示 是否删除
   *      1 确定 直接执行删除
   *      2 取消 什么都不做 
   *  4 直接修改商品对象的数量 num
   *  5 把cart数组重新设置回 缓存中 和data中 this.setCart
   * 9 点击结算
   *  1 判断有没有收货地址
   *  2 判断用户有没有选购商品
   *  3 经过以上的验证 跳转到支付页面
   */
  
  async handleChooseAddress(){
    // 1 获取权限状态
    // wx.getSetting({
    //   success:(result)=>{
    //     // 2 获取权限状态 只要发现一些属性名很怪异都要使用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if(scopeAddress===true || scopeAddress===undefined){
    //       // 获取收货地址
    //       wx.chooseAddress({
    //         success:(res)=>{

    //         }
    //       });
    //     }else{
    //       // 3 拒绝过授予权限 先诱导用户授予权限
    //       wx.openSetting({
    //         success:(result1)=>{
    //           // 4 可以调用 收货地址代码
    //           // 获取收货地址
    //           wx.chooseAddress({
    //             success:(res1)=>{

    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // });
    try {
      // 1 获取权限状态
      const res1 = await getSetting();
      // 2 获取权限状态 只要发现一些属性名很怪异都要使用[]形式来获取属性值
      const scopeAddress = res1.authSetting["scope.address"];
      // 3 判断权限状态
      if(scopeAddress===false){
        // 4 拒绝过授予权限 先诱导用户授予权限
        await openSetting();
      }
      // 5 调用获取收货地址的API 
      let address = await chooseAddress();
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 6 存入缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error);
    }
  },

  // 设置购物车状态同时  重新计算 底部工具栏的数据 全选总价格 购买的数量
  setCart(cart){
    let allChecked=true;
    // 1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    // 判断数组cart是否为空
    allChecked=cart.length!=0?allChecked:false;
    // 5 6把购物车数据重新设置回data中 和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('cart', cart);
  },
  // 商品的选中
  handleItemChange(e){
    // 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id);
    // 4 选中状态取反
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
  },

  // 商品的全选功能
  handleItemAllCheck(){
    // 1 获取data中的数据
    let {cart,allChecked}=this.data;
    // 2 修改值
    allChecked=!allChecked;
    // 3 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 4 把修改后的值填充回data中或者缓存中
    this.setCart(cart);
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e){
    // 1 获取传递过来的参数 
    const {operation,id}=e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart} = this.data;
    // 3 找到需要修改的商品索引
    const index = cart.findIndex(v=>v.goods_id===id);
    // 4 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      // 4.1 弹窗提示
      const res = await showModal({content:"您是否要删除？"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      // 4.2 进行修改数量
      cart[index].num+=operation;
      // 4.3 设置回缓存和data中
      this.setCart(cart);
    }
  },

  // 点击结算
  async handlePay(){
    // 1 判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 2 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart')||[];
    // 计算全选
    // every 数组方法 会遍历 接受一个回调函数 每一个回调函数都为true every也为true
    // 只要有一个返回false 不再循环 直接返回false
    // 空数组调用every返回值就是true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    // let allChecked=true;
    this.setData({address});
    this.setCart(cart);
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})