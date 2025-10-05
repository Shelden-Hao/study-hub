export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/register/index',
    'pages/rooms/index',
    'pages/room-detail/index',
    'pages/reservations/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '自习室预约平台',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1890ff',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/rooms/index',
        text: '自习室'
      },
      {
        pagePath: 'pages/reservations/index',
        text: '我的预约'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的'
      }
    ]
  }
})
