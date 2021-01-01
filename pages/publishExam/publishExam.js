// pages/publishExam/publishExam.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {
      crs_id: 1,
      te_id: 20,
      countStu: 6,
      crs_name: "大学数学",
      countExam: 3,
      cl_name: "信统17202",
      status: "1"
    },
    userInfo: {
      t_id: 1,
      t_name: "张老师",
      t_createTime: "2020-08-06T16:00:00.000Z",
      t_openid: "",
      tno: "t001"
    },
    knowledge: [],
    knowledgeList: [],
    isKnowSelected: false,
    isTimeSelected: false,
    isDateSelected: false,
    nowDate:'',
    nowTime:'00:00',
    date:"截止日期",
    time:"截止时间"
  },
  /**
   * 选择日期
   */
  chooseDate:function(e){
    let that = this
    console.log(e)
    that.setData({
      date:e.detail.value,
      isDateSelected: true
    })
  },
    /**
   * 选择时间
   */
  chooseTime:function(e){
    let that = this
    console.log(e)
    that.setData({
      time:e.detail.value,
      isTimeSelected: true
    })
  },
  /**
   * 选择知识点
   */
  chooseKnow: function (e) {
    var that = this;
    // console.log(e)
    that.setData({
      indexKnow: e.detail.value,
      isKnowSelected: true
    })
  },

  /**
   * 发布测试
   */
  commit: function (e) {
    var that = this;
    var flag = that.data.isTimeSelected&&that.data.isDateSelected&&that.data.isKnowSelected;
    let nowTime = new Date()
    // nowTime = nowTime.getFullYear('zh')+'-'+(nowTime.getMonth('zh')+1)+'-'+nowTime.getDate('zh')
    // time = nowTime.getTime
    let endTime = `${that.data.date} ${that.data.time}`
    let endTimeStand = new Date(endTime)
    if((endTimeStand-nowTime)/(1000*60)<10){
      wx.showModal({
        title: '时间过短',
        content:"截止时间距现在不得小于10分钟"
      })
    }else{
    var exName = "test";
    var memo = "测试";
    if (flag) {
      wx.showModal({
        title: '确认发布',
        content: '是否发布测试？',
        success(res) {
          if (res.confirm) {
            var examData = {};
            var knowledgeList = that.data.knowledgeList;
            var staKnName = that.data.knowledge[that.data.indexKnow];
            for (var i in knowledgeList) {
              if (knowledgeList[i].kn_name == staKnName) {
                examData.kn_id = knowledgeList[i].kn_id
              }
            }
            var te_id = that.data.course.te_id;
            examData.endTime = endTime;
            examData.te_id = te_id;
            examData.exName = exName;
            examData.memo = memo;
            // console.log(examData)
            fuc.request(api.publicExamTest, examData).then(function (res) {
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                mask: true,
                complete(res) {
                  wx.navigateTo({
                    url: '../teaIndex/teaIndex',
                  })
                }
              })
            })
          } else if (res.cancel) {}
        }
      })
    } else {
      wx.showModal({
        title: '信息缺失!',
        content: '请完善信息！',
      })
    }}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /**
     * 接收参数,将json字符串转换成对象
     */
    var newCourse = JSON.parse(options.course);
    var userInfo = JSON.parse(options.userInfo);
    that.setData({
      course: newCourse,
      userInfo
    })
    /* 获取当前日期 */
    // const rule = { weekday: undefined, year: 'numeric', month: 'long', day: 'numeric' };
    let nowDate = new Date()
    // console.log(nowDate)
    nowDate = nowDate.getFullYear('zh')+'-'+(nowDate.getMonth('zh')+1)+'-'+nowDate.getDate('zh')
    // let nowTime = new Date().toLocaleTimeString('chinese', { hour12: false })
    // let reg = new RegExp("/","g")
    // nowDate = nowDate.replace(reg,"-")
    // nowTime = nowTime.substr(0,5)
    that.setData({
      nowDate
    })
    // console.log(nowDate)

    /**
     * 获取课程列表
     */
    var crs_id = newCourse.crs_id;
    // var crs_id = that.data.course.crs_id;
    // console.log(crs_id)
    fuc.request(api.getKnowledgeBycrs_id, {
      crs_id
    }).then(function (res) {
      var knowledgeList = res.data;
      var knowledge = [];
      console.log(knowledgeList);
      for (var x in knowledgeList) {
        knowledge.push(knowledgeList[x].kn_name)
      }
      console.log(knowledge);
      that.setData({
        knowledgeList: knowledgeList,
        knowledge: knowledge
      })
    })
  }
})