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
          <p>{{item.name}}</p>
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
                @click="router.push(`/categorias/${item.id}`)"
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
import { ref } from "vue";
import FormProduct from './../components/FormProduct.vue'

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();
databaseStore.getAllProducts();
const showForm = ref(true);

const hiddenForm = () => {
  showForm.value = !showForm.value;
}

const confirm = async (id) => {
  const error = await databaseStore.deleteCategorie(id);
  if (!error) return message.success("Categoria eliminada con éxito ⭐");
  return message.error(error);
};

const cancel = () => {
  message.error("Eliminacion cancelada 👻");
};
</script>


<style lang='scss'>

</style>