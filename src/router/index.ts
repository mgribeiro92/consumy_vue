import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignIn from '../views/SignInView.vue'
import SignUp from '../views/SignUpView.vue'
import Stores from '../components/Stores.vue'
import Products from '../components/Products.vue'
import UserView from '@/views/UserView.vue'
import Teste from '../views/TesteView.vue'
import OrdersView from '../views/OrdersView.vue'
import { Auth } from '@/auth'

const auth = new Auth()
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
      path: '/stores',
      name: 'stores',      
      component: Stores,     
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
      path: '/teste',
      name: 'teste',      
      component: Teste,         
    },
  ]
})

export default router
