<script setup lang="ts">

import router from '@/router';
import eventBus from '@/event';
import { Auth } from '../auth'
import { ref, onMounted } from 'vue'

const auth = new Auth()
const currentUser = ref(auth.currentUser())

const show_cart = ref(false)

function logOut() {
  console.log('logout chamado')
  auth.signOut()
  window.location.reload()
}

const emit = defineEmits(['cartClicked']);
const handleCartClick = () => {
  emit('cartClicked');
}
</script>

<template> 
  <nav class="navbar navbar-expand">
    <div class="container-fluid">
      <a class="navbar-brand">SaborExpress</a>    
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">          
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>                                 
        </ul>        
        <ul class="d-flex navbar-nav">
          <li class="nav-item">         
            <img @click="handleCartClick" src="../assets/carrinho-de-compras.png" alt="cart">
          </li>
          <div class="dropdown">
            <button class="dropbtn dropdown-toggle">
              <img src="../assets/do-utilizador (2).png" alt="Profile">
            </button>            
            <div class="dropdown-content">
              <RouterLink class="nav-link" to="/orders">Orders</RouterLink>
              <a href="#">Profile</a>
              <hr>
              <button @click="logOut">Sign Out</button>
            </div>
          </div>
          
        </ul>
      </div>
    </div>  
  </nav>

</template>

<style scoped>

  nav {      
    background:	white;
    width: 100%;
    border-bottom: 2px solid #8b0000;
    position: relative;
    z-index: 1; /* Garante que a navbar fique acima da sidebar */
  }

  img {
    width: 30px;
    color: #8b0000;
    margin-right: 10px;
    cursor: pointer;
  }


  .nav-link {
    color: 	#8b0000;
  }


  .nav-link:hover {
    color: #228b22;
  }

  .navbar-brand {
    color:	#8b0000;
  }

  /* Estilos para o botão do menu */
.dropbtn {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

/* Estilos para o dropdown quando estiver aberto */
.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #fff;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Estilos para os links no dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Estilos para os links no dropdown quando hover */
.dropdown-content a:hover {
  background-color: #f1f1f1;
}

/* Mostrar o dropdown quando o botão é clicado */
.dropdown:hover .dropdown-content {
  display: block;
}

  
</style>
