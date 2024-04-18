<script>

import axios from 'axios';
const token = localStorage.getItem('token')

const config = {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
};

export default { 
  data() {
    return {
      user: {},
    }
  },
  created() {
    axios.get('/me', config)
      .then(response => {
        this.user = response.data;
        console.log(this.user)
      })
    .catch(error => {
      console.error('Erro ao buscar dados da API:', error);
    });
  },
}

</script>


<template>
  {{ currentUser }}
    <div class="card-user">
			<p><strong>Email:</strong> {{user.email}} </p>
			<p><strong>Id:</strong> {{user.id}} </p>
    </div>
    
</template>

<style>

	.card-user {
		border-radius: 5px;
		border: 2px solid #d0f0c0;
		margin: 10px;
		padding: 10px;
		width: 300px;
	}

</style>