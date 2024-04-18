<script setup lang="ts">

import { onMounted } from 'vue';
import eventBus from '@/plugins/EventBus';

onMounted(() => {
	console.log('log do created')
	eventBus.on("sign_in", dados => {
    console.log(dados)
    console.log('log dos dados recebidos')
  })  
})

</script>

