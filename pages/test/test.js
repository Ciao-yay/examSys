var fuc = require("../../utils/fuc.js");
var api = require("../../utils/api.js");
import moment from 'moment'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    exams:[]
    

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let result =await fuc.request(api.getExamList,{sid:4})
    let exams = result.data.data 
    exams = this.formatTime(exams)
    console.log(exams)
    this.setData({
      exams
    })
  },
  // 格式化时间
  formatTime(exams){
    return exams.forEach(item=>{
      item.startTime =moment(item.startTime).format('YYY-MM-DD HH:mm:ss')
      item.finishTime=moment(item.finishTime).format('YYY-MM-DD HH:mm:ss')
      item.public_time=moment(item.public_time).format('YYY-MM-DD HH:mm:ss')
      item.end_time=moment(item.end_time).format('YYY-MM-DD HH:mm:ss')
      return item 
    })
  },

})