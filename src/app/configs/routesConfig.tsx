import FuseUtils from '@fuse/utils'
import FuseLoading from '@fuse/core/FuseLoading'
import { Navigate } from 'react-router-dom'
import settingsConfig from 'app/configs/settingsConfig'
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils'
import SignInConfig from '../main/sign-in/SignInConfig'
import SignUpConfig from '../main/sign-up/SignUpConfig'
import SignOutConfig from '../main/sign-out/SignOutConfig'
import Error404Page from '../main/404/Error404Page'
import ExampleConfig from '../main/example/ExampleConfig'
import DashboardConfig from '../main/dashboard/DashboardConfig'
import ProfileConfig from '../main/profile/ProfileConfig'
import GradesConfig from '../main/grades/GradesConfig'
import HomeConfigPage from '../main/home/HomePageConfig'
import CoursePageConfig from '../main/course/CoursePageConfig'
import TopicPageConfig from '../main/topic/TopicPageConfig'
// import TodoPageConfig from '../main/todo/TodoPageConfig';
import SubjectPageConfig from '../main/subject/SubjectPageConfig'
import SessionPageSlideshowConfig from '../main/session-slideshow/SessionPageConfig'
import TodoPageExamConfig from '../main/todo-exam/TodoPageExamConfig'
import TodoPageActivityConfig from '../main/todo-activity/TodoPageActivityConfig'

const routeConfigs: FuseRouteConfigsType = [
  GradesConfig,
  ProfileConfig,
  ExampleConfig,
  HomeConfigPage,
  CoursePageConfig,
  TopicPageConfig,
  // TodoPageConfig,
  TodoPageExamConfig,
  TodoPageActivityConfig,
  SubjectPageConfig,
  SignOutConfig,
  SessionPageSlideshowConfig,
  DashboardConfig,
  SignInConfig,
  SignUpConfig,
]

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: '/',
    element: <Navigate to="/" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    // ex. courses/1/
    path: '/courses/:courseid',
    element: <Navigate to="/courses/:courseid" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    // ex. courses/1/subjects/2/
    path: '/courses/:courseid/subjects/:subjectid',
    element: <Navigate to="/courses/:courseid/subjects/:subjectid" />,
    auth: settingsConfig.teacherAuth,
  },
  {
    // ex. courses/1/subjects/2/topics/3
    path: '/courses/:courseid/subjects/:subjectid/topics/:topicid/slideshow',
    element: (
      <Navigate to="/courses/:courseid/subjects/:subjectid/topics/:topicid/slideshow" />
    ),
    auth: settingsConfig.defaultAuth,
  },
  {
    // ex. courses/1/subject/2/topics/3/sessions/4
    path: '/courses/:courseid/subjects/:subjectid/topics/:topicid/sessions/:sessionid/edit',
    element: (
      <Navigate to="/courses/:courseid/subjects/:subjectid/topics/:topicid/sessions/:sessionid/edit" />
    ),
    auth: settingsConfig.defaultAuth,
  },
  {
    // ex. courses/1/subject/2/topics/3/sessions/4/sessionitems/5
    path: '/courses/:courseid/subjects/:subjectid/topics/:topicid/todos/:todoid/exam',
    element: (
      <Navigate to="/courses/:courseid/subjects/:subjectid/topics/:topicid/todos/:todoid/exam" />
    ),
  },
  {
    // ex. courses/1/subject/2/topics/3/sessions/4/sessionitems/5
    path: '/courses/:courseid/subjects/:subjectid/topics/:topicid/todos/:todoid/activity',
    element: (
      <Navigate to="/courses/:courseid/subjects/:subjectid/topics/:topicid/todos/:todoid/activity" />
    ),
  },
  {
    element: <Navigate to="/dashboard" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: '/profile',
    element: <Navigate to="/profile" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: '/grades',
    element: <Navigate to="/grades" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
]

export default routes
