// components/examList/examList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    exams: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    exam: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 展示描述的弹窗
    showExamDescribe(e) {
      console.log(e.currentTarget.dataset)
      let exam = e.currentTarget.dataset.exam
      this.setData({
        show: true,
        exam
      });
    },
    // 关闭弹窗
    onClose() {
      this.setData({ show: false });
    },
    // 判断是进入测试还是查看详情
    chooseWay(){
      let exam = this.data.exam
      if(exam.score){
        this.toReplyDetail(exam)
      }else{
        if(exam.isOut){
          wx.showToast({
            title:"该测试已过截止时间",
            icon:"none",
            duration:1000
          })
        }else{
          this.joinExam(exam)
        }
      }
    },
    // 查看作答详情
    toReplyDetail(exam){
      wx.navigateTo({
        url:"/pages/examDes/examDes",
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { exam })
          }
      })
    },
    // 参加测试
    joinExam(exam){

    }
  }
})
