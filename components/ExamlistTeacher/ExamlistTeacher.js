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
        // 提示弹窗   
        onCellClose(event) {
            const { position, instance } = event.detail;
            switch (position) {
                case 'left':
                case 'cell':
                    instance.close();
                    break;
                case 'right':
                    Dialog.confirm({
                        message: '确定删除吗？',
                    }).then(() => {
                        instance.close();
                    });
                    break;
            }
        },
        // 判断是进入测试还是查看详情
        chooseWay() {
            let { exam } = { ...this.data }
            this.toReplyDetail(exam)
        },
        // 查看测试详情
        toCourseDetail(exam) {
            wx.navigateTo({
                url: "/pages/courseDetail/courseDetail",
                success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage', { exam })
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
