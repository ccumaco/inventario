<template>
  <div class="container-cards">
    <router-link class="card" :to="item.path" v-for="(item, index) of routes" :key='index'>
      <img :src="item.img" alt="icon">
      <p>{{ item.name }}</p>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Image1 from './../assets/icons/admin.svg'
import Image2 from './../assets/icons/products.svg'
const routes = ref([
  { name: 'Home', path: '/perfil', name: 'Perfil', img: Image1},
  { name: 'About', path: '/productos', name: 'Productos', img: Image2},
  { name: 'Contact', path: '/categorias', name: 'Categorias', img: Image2},
])
</script>

<style lang='scss'>
.container-cards{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  .card{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: calc(50% - 20px);
    border-radius: 10px;
    background-color: #2f279b;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    transition: all 0.3s ease-in-out;
    &:hover{
      transform: scale(1.1);
    }
    img{
      width: 100px;
      height: 100px;
    }
  }
}
</style>
