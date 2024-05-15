<script setup lang="ts">
import { Auth } from '@/auth'
import { ref, onMounted, onUpdated } from 'vue'
import NavBar from '@/components/NavBar.vue';

const auth = new Auth()
const currentUser = ref(auth.currentUser())
const isLoggedIn = ref(auth.isLoggedIn())

const signOut = function() {
  console.log('logout chamado')
  auth.signOut(() => {
    currentUser.value = auth.currentUser()
  })
}

</script>

<template>

  <h3>Hi, {{ currentUser && currentUser.email }}</h3>    
  <br />    
  <a @click="signOut">Sign Out</a>    
  
</template>


<style scoped>

  body {
    align-items: left;
    justify-content: left;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: right;
    height: 100vh;
    background-image: url('../assets/background-site.png');  
    background-size: cover; 
  }

  .welcome {
    width: 500px;
    height: 400px;
    opacity: 1.0;
    border-radius: 20px;
    background-color: white;
    text-align: center;
    padding: 40px 20px;
    margin-right: 80px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  } 

  .welcome img {
    width: 200px;
    height: 200px;
    flex: 0.6;
    border-left: 2px solid #fa9901    
  }

  .img-btn {
    display: flex;
    align-items: center; 
  }

  .btn-sign {
    display: flex;
    flex-direction: column;
    flex: 0.4;
    align-items: center;
  }

  h2 {
		color: #fa9901
	}
	
	p {
		color: #421010
	}

  .button {
    color: #fa9901;
    border-bottom: 2px solid #fa9901;
    padding: 5px 10px;
		margin: 10px 0px;    
		cursor: pointer;
    text-decoration: none;
    height: 35px;
    width: 100px;
    text-align: center;    
  }

  .button:hover {
    background-color: #421010;
    color: white;
    border-radius: 5px;
  }
  
</style>