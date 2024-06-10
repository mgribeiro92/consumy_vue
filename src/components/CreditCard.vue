<script setup lang="ts">

import { ref } from 'vue'

const number = ref()
const valid = ref()
const cvv = ref()
const order_in_progress = ref(false)

const { total } = defineProps(['total'])
console.log(total)

const emit = defineEmits(['sendCreditCard'])
function getPayment() {
  console.log('ta passando aqui no get payment')
  order_in_progress.value = true
  const credit_card = {
    number: number.value,
    valid: valid.value,
    cvv: cvv.value
  }
  emit('sendCreditCard', credit_card)
}

const formatCardNumber = () => {
  let value = number.value.replace(/\D/g, '')  
  if (value.length > 16) {
    value = value.slice(0, 16)
  }  
  number.value = value.replace(/(.{4})/g, '$1-').replace(/-$/, '');
};


</script>

<template>

  <div class="modal">
    <div class="modal-content">
      <h3 style="text-align: center;">Pagamento</h3>
      <p>Insira as informações do seu cartão de crédito</p>
      <div>
        <div class="form-group">
          <div class="card-number">
            <label>Número do Cartão</label>
            <input type="text" style="width: 400px;" maxlength="19"  @input="formatCardNumber" class="form-control" v-model="number">
          </div>          
        </div>
        <div class="form-group mt-4">
          <div class="card-info">
            <div class="date">
              <label>Data Validade</label>
              <input type="date" class="form-control" v-model="valid">
            </div>
            <div class="cvv">
              <label>CVV</label>
              <input type="password" class="form-control" maxlength="3" v-model="cvv">
            </div>
          </div>          
        </div>
        <div>Valor total: {{ total }}</div>
        <button class="mt-4" @click="getPayment">Finalizar Pedido</button>
      </div>
    </div>
  </div>


</template>

<style scoped>

  .card-info {
    display: flex;
    gap: 50px;
  }

</style>