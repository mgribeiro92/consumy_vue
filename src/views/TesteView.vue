<template>
  <div>
    <h1>Lista de Compras</h1>
    <draggable v-model="items" tag="ul">
      <template #item="{ element }">
        <li>{{ element }}</li>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';

const items = ref(['Maçãs', 'Bananas', 'Laranjas', 'Pêssegos']);
</script>
