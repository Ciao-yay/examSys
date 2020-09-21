const ApiRootUrl = "https://www.nciao.cn/exam/";
// const ApiRootUrl = "http://localhost:8080/exam/";
const Student = "student/";
const Teacher = "teacher/";

module.exports = {
  getLatexSubject: ApiRootUrl + Teacher + "getLatexSubject", //Latex测试
  addExamKnow: ApiRootUrl + Teacher + "addExamKnow", //发布测试
  publicExam: ApiRootUrl + Teacher + "publicExam", //发布测试
  getKnowledgeBycrs_id: ApiRootUrl + Teacher + "getKnowledgeBycrs_id", //获取知识点列表
  getExamInfoByte_id: ApiRootUrl + Teacher + "getExamInfoByte_id", //获取课程列表
  addTeach: ApiRootUrl + Teacher + "addTeach", //获取课程列表
  getCourseList: ApiRootUrl + Teacher + "getCourseList", //获取课程列表
  getClassList: ApiRootUrl + Teacher + "getClassList", //获取班级列表
  getTeachInfo: ApiRootUrl + Teacher + "getTeachInfo", //获取授课信息
  getTeacherInfo: ApiRootUrl + Teacher + "getTeacherInfo", //获取教师信息
  test: ApiRootUrl + Student + "getFirstSubjectTest", //获取第一道题的测试
  getExamInfo: ApiRootUrl + Student + "getExamInfo", //获取考试信息的测试
  addReplyRecord: ApiRootUrl + Student + "addReplyRecord", //获取答题记录
  commitResult: ApiRootUrl + Student + "commitResult", //提交考试结果

  // userInfor: ApiRootUrl + "user/user", //登录查询用户信息接口
  // bind: ApiRootUrl + "user/bind", //绑定用户信息接口
  // professionUrl: ApiRootUrl + "user/getProfession", //获取专业数据接口
  // questions: ApiRootUrl + "question/getQuestion", //试题信息接口
  // options: ApiRootUrl + "question/getOptions", //选项信息接口
  // paper: ApiRootUrl + "paper/getPaperList", //考试列表信息接口
  // againTestUrl: ApiRootUrl + "paper/againTest", //检查重复考试接口
  // modify: ApiRootUrl + "modify/modify", //修改答题接
  // markUrl: ApiRootUrl + "mark/getMarkList", //获取分数接口
  // getDetailListUrl: ApiRootUrl + "detail/getDetailList" //获取详细的答题记录
};