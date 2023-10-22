<template>
  <div class="container-view">
    <h1 v-if="databaseStore.products">Productos: {{ databaseStore.products.length }}</h1>
    <router-link class="button-create" to="/crear-producto">
      Crear nuevo producto
    </router-link>

    

    <p v-if="databaseStore.loadingDoc">loading docs...</p>
    
    <div class='container-cards' v-if="!databaseStore.loadingDoc">
    <template 
        v-for="item of databaseStore.products"
        :key="item.id">
        <div class="container-card" v-if='item.available'>
          <div class="flex align-center justify-center">
            <a-avatar :src="item.image"></a-avatar>
            <p class="ml-8">{{item.name}}</p>
          </div>
          <div>
              <a-popconfirm
                title="¿Estás seguro que deseas eliminar?"
                ok-text="Sí"
                cancel-text="No"
                @confirm="confirm(item.id)"
                @cancel="cancel"
              >
                <img src="./../assets/icons/trash.svg" class="icon-trash" alt="trash" width="30">
              </a-popconfirm>
              <img
                @click="router.push(`/editar-producto/${item.id}`)"
                src="./../assets/icons/edit.svg"
                class="icon-edit"
                alt="trash"
                width="30">
            </div>
          </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useDatabaseStore } from "../stores/database";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();
onMounted(() => {
  databaseStore.getAllProducts();
});
const showForm = ref(true);

const hiddenForm = () => {
  showForm.value = !showForm.value;
}

const confirm = async (id) => {
  const error = await databaseStore.deleteProduct(id);
  if (!error) return message.success("Categoria eliminada con éxito ⭐");
  return message.error(error);
};

const cancel = () => {
  message.error("Eliminacion cancelada 👻");
};
</script>


<style lang='scss'>

</style>