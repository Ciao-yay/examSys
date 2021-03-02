// components/examList/examList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    exams: {
      type: Array,
      value: []
    },
    userInfo: {
      type: Object,
      value: {}
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
    chooseWay() {
      let { exam, userInfo } = { ...this.data }

      if (exam.score) {
        this.toReplyDetail(exam)
      } else {
        if (exam.isOut) {
          this.showExamOut()
        } else {
          // 参加考试
          if (userInfo.todo >= 0) {
            wx.showModal({
              tittle: '不能进行当前考试',
              content: `还有测试未完成，是否前去完成`,
              success: res => {
                if (res.confirm) {
                  exam = this.data.exams[todo]
                  this.joinExam(exam)
                }
              }
            })
          } else {
            console.log(`参加考试`)
            this.joinExam(exam)
          }
        }
      }
    },
    // 查看作答详情
    toReplyDetail(exam) {
      this.onClose()
      wx.navigateTo({
        url: "/pages/examDes/examDes?exam="+JSON.stringify(exam),
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { exam })
        }
      })
    },
    /* 加入考试 */
    joinExam(exam) {
      this.onClose()
      let title = "是否立即参加考试？"
      let content = "点击确定立即开始考试！"
      if (exam.status == 1) {
        title = "继续答题？"
        content = "当前考试还未完成，点击确定继续答题！"
      }
      wx.showModal({
        title,
        content,
        success: res => {
          if (res.cancel) { } else {
            wx.reLaunch({
              url: '../preExam/preExam?exam=' + JSON.stringify(exam),
            })
          }
        }
      })
    },
    showExamOut() {
      wx.showToast({
        title: "该测试已过截止时间",
        icon: "none",
        duration: 1000
      })
    }
  }
})
