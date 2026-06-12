export default defineAppConfig({
  pages: [
    'pages/today/index',
    'pages/restaurants/index',
    'pages/create/index',
    'pages/chat/index',
    'pages/credit/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '午餐搭子',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8FAFC'
  },
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#FF6B6B',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/today/index',
        text: '今日饭局'
      },
      {
        pagePath: 'pages/restaurants/index',
        text: '附近餐厅'
      },
      {
        pagePath: 'pages/create/index',
        text: '发起拼饭'
      },
      {
        pagePath: 'pages/credit/index',
        text: '信用中心'
      }
    ]
  }
})
