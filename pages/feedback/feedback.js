/**
 * 1 点击 "+" 触发tap点击事件
 *    1 调用小程序内置的选择图片的api
 *    2 获取到图片路径 数组
 *    3 把图片路径存到data变量中
 *    4 页面就可以根据 图片数组 进行循环显示 自定义组件
 * 2 点击 自定义图片 组件
 *    1 获取被点击的元素的索引
 *    2 获取data中的图片数组
 *    3 根据索引数组中删除对应的元素
 *    4 把数组重新设置回data中
 * 3 点击 "提交"
 *    1 获取文本域内容
 *      1 data中定义变量 表示 输入框内容
 *      2 文本域 绑定输入事件 事件触发的时候把输入框的值 存入到变量中
 *    2 对这些内容 合法性验证
 *    3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网链接
 *      1 遍历图片数组
 *      2 挨个上传
 *      3 自己在维护图片数组 存放 图片上传后的外网的链接
 *    4 文本域内容 和 外网图片的路径一起提交到服务器(先不做，前端模拟)
 *    5 清空当前页面
 *    6 返回上一页
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 文本域内容
    textVal:"",
    // 被选中的图片路径数组
    chooseImgs:[],
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      }, {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ]
  },

  // 外网的图片路径数组
  UpLoadImgs:[],

  handleTabsItemChange(e){
    // console.log(e); 
    // 1 获取被点击标题索引
    const {index} = e.detail;
    // 2 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  // 点击 "+"选择图片事件
  handleChooseImage(){
    // 调用小程序内置的选择图片的api
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 图片来源 album 从相册选图，camera 使用相机，默认二者都有
      success: (result)=>{
        this.setData({
          // 把图片数组进行拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
  },

  // 点击自定义图片组件
  handleRemoveImg(e){
    // 获取被点击的组件的索引
    const {index} = e.currentTarget.dataset;
    // 获取data中的图片数组
    let {chooseImgs} = this.data;
    // 删除元素
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },

  // 文本域输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },

  // 提交按钮的点击
  handleFormSubmit(){
    // 获取文本域的内容 图片数组
    const {textVal,chooseImgs} = this.data;
    // 合法性验证
    if(!textVal.trim()){
      // 不合法
      wx.showToast({
        title:'输入不合法',
        icon:'none',
        mask:true
      });
      return;
    };
    // 3准备上传图片到专门图片服务器
    // 上传文件api不支持多文件同时上传  遍历数组挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title:"正在上传中",
      mask:true
    });

    // 判断有没有需要上传的图片数组
    if(chooseImgs.length!= 0){
      chooseImgs.forEach((v,i)=>{
      
        wx.uploadFile({
          // 图片要上传到哪里 新浪图床
          url: 'https://images.ac.cn/Home/Index/UpLoadAction/',
          // 被上传的文件的路径
          filePath:v,
          // 上传文件的名称 后台来获取文件 file(自定义的)
          name:'file',
          // 顺带的文本信息
          formData:{},
          // header: {}, // 设置请求的 header
          // formData: {}, // HTTP 请求中其他额外的 form data
          success: (res)=>{
            let url = JSON.parse(res.data).url;
            this.UpLoadImgs.push(url);
  
            // 所有的图片都上传完毕才触发
            if(i===chooseImgs.length-1){
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              // 提交成功
              // 页面重置
                this.setData({
                  textVal:"",
                  chooseImgs:[]
                })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1 // 回退前 delta(默认为1) 页面
              })
            }
          }
        });
      }) 
    }else{
      wx.hideLoading();

      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
      
    }
  }
})