import Vue from 'vue'
import Router from 'vue-router'

import index from '../pages/index/index.vue'
import fixedPanel from '../pages/index/children/fixedPanel.vue'
import message from '../pages/message/message.vue'

// import topics from '../pages/topics/topics.vue'
// import article from '../pages/topics/children/article/article.vue'
// import user from '../pages/user/user.vue'
// /* -- */ import usertopics from '../pages/user/children/usertopics/usertopics.vue'

// import test from '../pages/test/test.vue'

Vue.use(Router)

const routes = [
  {
    name: 'index',
    path: '/index',
    component: index,
    children: [
      {
        name: 'fixedPanel',
        path: 'fixedPanel/:type',
        component: fixedPanel
      }
    ]
  },
  {
    name: 'message',
    path: '/message',
    component: message
  }
]

const router = new Router({
  routes
})

router.push({name: 'index', params: {title: ''}})

export default router
