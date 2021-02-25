// 测试服务器
// const ApiRootUrl = "https://www.nciao.cn/exam/";
// 本地服务器
const ApiRootUrl = "http://localhost:8080/exam/";
const ApiRootUrlV1 = "http://localhost:8080/v1/exam/";
// 正式服务器
// const ApiRootUrl = "https://examsys.nciao.cn/examSystem/";
const Student = "student/"; //学生
const Teacher = "teacher/"; //老师
const Test = "test/"; //登录
const Tests = "tests/"; //功能测试

module.exports = {
  /* 新接口 */
  /* 考试 */
  getExamList: `${ApiRootUrlV1}/examList`,// 获取测试列表
  getReplyDetail:`${ApiRootUrlV1}/replyDetail`,// 获取测试列表
  /* 用户 */
  /* 功能测试 */
  tGetWrongSubs: ApiRootUrl + Tests + "tGetWrongSubs", //查询错题
  tGetSubjects: ApiRootUrl + Tests + "tGetSubjects", //快速登陆
  teacherTest: ApiRootUrl + Test + "teacherTest", //快速登陆
  /* 老师模块 */
  getLatexSubject: ApiRootUrl + Teacher + "getLatexSubject", //Latex测试
  publicExamTest: ApiRootUrl + Teacher + "publicExamTest", //发布测试
  getKnowledgeBycrs_id: ApiRootUrl + Teacher + "getKnowledgeBycrs_id", //获取知识点列表
  getExamInfoByte_id: ApiRootUrl + Teacher + "getExamInfoByte_id", //获取考试信息
  addTeach: ApiRootUrl + Teacher + "addTeach", //获取课程列表
  getCourseList: ApiRootUrl + Teacher + "getCourseList", //获取课程列表
  getClassList: ApiRootUrl + Teacher + "getClassList", //获取班级列表
  getTeachInfo: ApiRootUrl + Teacher + "getTeachInfo", //获取授课信息
  getTeacherInfo: ApiRootUrl + Teacher + "getTeacherInfo", //获取教师信息
  /* 学生模块 */
  getSubByid: ApiRootUrl + Student + "getSubByid", //错题
  getWrongSubKnow: ApiRootUrl + Student + "getWrongSubKnow",
  getCourseListBysid: ApiRootUrl + Student + "getCourseListBysid",
  hasRecord: ApiRootUrl + Student + "hasRecord", //查考试记录并返回答题结果
  toTodo: ApiRootUrl + Student + "toTodo", //更改状态
  getExamAllBySid: ApiRootUrl + Student + "getExamAllBySid", //获取考试信息
  test: ApiRootUrl + Student + "getFirstSubjectTest", //获取第一道题的测试
  getExamInfo: ApiRootUrl + Student + "getExamInfo", //获取考试信息的测试
  addReplyRecord: ApiRootUrl + Student + "addReplyRecord", //获取答题记录
  commitResult: ApiRootUrl + Student + "commitResult", //提交考试结果
  /* 登录模块 */
  fastLogin: ApiRootUrl + Test + "fastLogin", //快速登陆
  bindUser: ApiRootUrl + Test + "bindUser", //绑定用户测试
  loginTest: ApiRootUrl + Test + "loginTest", //登录测试
  getOpenid: ApiRootUrl + Test + "getOpenid", //获取openid
};