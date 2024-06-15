import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignIn from '../views/SignInView.vue'
import SignUp from '../views/SignUpView.vue'
import Stores from '../components/Stores.vue'
import Products from '../components/Products.vue'
import UserView from '@/views/UserView.vue'
import Chats from '../components/Chats.vue'
import OrdersView from '../views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign_in',
      name: 'sign_in',
      component: SignIn,
      meta: { showNavBar: false }
    },
    {
      path: '/sign_up',
      name: 'sign_up',
      component: SignUp,
      meta: { showNavBar: false }
    },    
    {
      path: '/',
      name: 'home',
      component: HomeView             
    }, 
    {
      path: '/store/:storeId/products',
      name: 'products',      
      component: Products,         
    },
    {
      path: '/user',
      name: 'user',      
      component: UserView,         
    },
    {
      path: '/orders',
      name: 'orders',      
      component: OrdersView,         
    },
    {
      path: '/chats',
      name: 'chats',      
      component: Chats,         
    },
  ]
})

export default router
