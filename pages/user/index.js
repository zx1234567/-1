//index.js
//获取应用实例
var fun_md5 = require('../../utils/md5.js')
var fun_sha1 = require('../../utils/sha1.js')
var fun_base64 = require('../../utils/base64.js')
var fun_aes = require('../../utils/aes.js')
var app = getApp()
//十六位十六进制数作为秘钥
var key = fun_aes.CryptoJS.enc.Utf8.parse("5de7e29919fad4d5");
//十六位十六进制数作为秘钥偏移量
var iv = fun_aes.CryptoJS.enc.Utf8.parse('5de7e29919fad4d5');  
Page({
  data: {
    phone: '',
    password: '',
    show_base64_encode: ''
  },

  // 获取输入账号  
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码  
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  Decrypt: function (word) {
    var encryptedHexStr = fun_aes.CryptoJS.enc.Hex.parse(word);
    var srcs = fun_aes.CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = fun_aes.CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    var decryptedStr = decrypt.toString(fun_aes.CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },
  // 登录  
  login: function () {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: "帐号与密码不能为空！！！",
        icon: 'loading',
        duration: 2000
      })



    } else {

      var that = this
      var obj_base64 = new fun_base64.Base64();
      var str_base64_decode = obj_base64.decode("{\"phone\":" + this.data.phone + ",\"password\":" + this.data.password + "}");
      console.log(str_base64_decode.toString());
      wx.request({
        url: 'http://192.168.2.112/userLogin',
        method: 'POST',
        data: {
          "s": str_base64_decode
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            images1: res.data

          })
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          })

        }
      })
      // 这里修改成跳转的页面  
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000
      })
    }
  }
})  
