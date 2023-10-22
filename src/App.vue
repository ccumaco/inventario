<template>
    <router-link to="/">Home</router-link>
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