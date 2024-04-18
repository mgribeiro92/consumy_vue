import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignIn from '../views/SignInView.vue'
import SignUp from '../views/SignUpView.vue'
import Stores from '../components/Stores.vue'
import Products from '../components/Products.vue'
import UserView from '@/views/UserView.vue'
import Teste from '../views/TesteView.vue'
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
      component: HomeView,
      meta: { showNavBar: false },                
    }, 
    {
      path: '/stores',
      name: 'stores',      
      component: Stores,
      beforeEnter (_, __, next) { 
        if (auth.isLoggedIn()) {       
          next();
          return;
        }
        next('/sign_in')
      }       
    },
    {
      path: '/stores/:storeId/products',
      name: 'products',      
      component: Products,         
    },
    {
      path: '/user',
      name: 'user',      
      component: UserView,         
    },
    {
      path: '/teste',
      name: 'teste',      
      component: Teste,         
    },
  ]
})

export default router
