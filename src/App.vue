<template>
    <router-link class="header" to="/">Home</router-link>
    <div v-if="userStore.loadingSession">loading user...</div>
    <router-view v-else></router-view>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "./stores/user";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();

const selectedKeys = ref([]);

// console.log(route.name);
watch(
    () => route.name,
    () => {
        selectedKeys.value = [route.name];
    }
);
</script>
<style lang='scss'>
.header{
    display: block;
    text-align: center;
    align-items: center;
    padding: 20px;
    background-color: #1890ff;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
    &:hover{
        color: #fff;
        text-decoration: none;
    }
}
</style>