/**
 * promise形式getSetting
 */
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    })
}
/**
 * promise形式chooseAddress
 */
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    })
}
/**
 * promise形式openSetting
 */
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    })
}

/**
 * promise形式showModal
 */
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
       // 4.1 弹窗提示
      wx.showModal({
        title: '提示',
        content: content,
        success :(res)=> {
          resolve(res);
        },
        fail:(err)=>{
            reject(err);
        }
      });
    })
}
/**
 * promise形式showToast
 */
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            mask: true,
            success :(res)=> {
                resolve(res);
            },
                fail:(err)=>{
                reject(err);
            }
        });
    })
}
/**
 * promise形式login
 */
export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });
    })
}
/**
 * promise形式requestPayment
 * pay 支付所必要的参数
 */
export const requestPayment=({pay})=>{
    return new Promise((resolve,reject)=>{
       wx.requestPayment({
        ...pay,
        success: (result)=>{
            resolve(result);
        },
        fail: (err)=>{
            reject(err);
        }
       });
    })
}