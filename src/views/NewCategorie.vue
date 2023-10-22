<template>
  <div class="container-view">
    <h1>{{ isEdit ? 'Editar' : 'Crear' }} catégoria</h1>
    <a-form
      name="editform"
      autocomplete="off"
      layout="vertical"
      :model="categorie"
      @finish="onFinish"
    >
      <a-form-item
        name="name"
        :rules="[
          {
            required: true,
            whitespace: true,
            pattern: /^.{1,30}$/,
            message: 'Longitud máxima 30 caracteres',
          },
        ]"
      >
        <a-input v-model:value="categorie.name"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="databaseStore.loading"
          :disabled="databaseStore.loading"
        >
        {{ isEdit ? 'Editar' : 'Crear' }} categoria
        </a-button>
      </a-form-item>
    </a-form>
    {{ categorie }}
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useDatabaseStore } from "../stores/database";
import { message } from "ant-design-vue";

const databaseStore = useDatabaseStore();
const isEdit = ref(false);
const route = useRoute();

let categorie = reactive({
  name: "",
});

const onFinish = async (value) => {
  if (route.params.id, isEdit.value) {
    return await databaseStore.updateCategorie( route.params.id,value);
  }
  return await createCategorie(value);

};

const createCategorie = async (value) => {
  console.log(value.name, route.params.id);
  const error = await databaseStore.addCategorie(value.name);
  if (!error) {
    categorie = "";
    return message.success("Categoria editada correctamente");
  }

  switch (error) {
    // buscar errores de firestore
    default:
      message.error(
        "Ocurrió un error en el servidor intentelo más tarde..."
      );
      break;
  }
};

onMounted(async () => {
  if (route.params.id) {
    isEdit.value = true;
    categorie = await databaseStore.getCategorie(route.params.id);
    console.log(categorie);
  }
});
</script>
