<script setup>
//set name component of FormProduct
import { reactive } from "vue";
import { useDatabaseStore } from "../stores/database";
import { message } from "ant-design-vue";
import { useUserStore } from "../stores/user";
import { ref } from 'vue';
const userStore = useUserStore();
const databaseStore = useDatabaseStore();
databaseStore.getCategories()
const options = databaseStore.documents.map((item, index) => {
  return {
    label: item.name,
    value: (index + 10).toString(36) + (index + 1),
  };
});
const formState = reactive({
    name: "",
    stock: "",
    price: "",
    description: "",
    categories: [],
});

const popupScroll = () => {
  console.log('popupScroll');
};

const onFinish = async (value) => {
    const error = await databaseStore.addCategorie(formState.name);
    if (!error) {
        formState.name = "";
        return message.success("Categoria creada con éxito ⭐");
    }

    switch (error) {
        // buscar errores de firestore
        default:
            console.log(error);
            message.error(
                "A ocurrido un error inesperado ⚠️"
            );
            break;
    }
};
</script>

<template>
    <div class="text-center mb-5">
        <a-avatar :src="userStore.userData.photoURL" :size="150"></a-avatar>
    </div>
    <a-form
        name="addform"
        autocomplete="off"
        layout="vertical"
        :model="formState"
        @finish="onFinish"
        >
        <a-upload
            v-model:file-list="formState.fileList"
            list-type="picture"
            >
            <a-button class="mb-4">Subir foto perfil</a-button>
        </a-upload>
        <a-form-item
            name="name"
            label="Ingrese el nombre del producto"
            :rules="[
                {
                    required: true,
                    whitespace: true,
                    pattern: /^.{1,30}$/,
                    message: 'Longitud máxima 30 caracteres',
                },
            ]"
        >
            <a-input placeholder='Nombre' v-model:value="formState.name"></a-input>
        </a-form-item>
        <a-form-item
            name="stock"
            label="Cantidad disponible"
            :rules="[
                {
                    required: true,
                    whitespace: true,
                    pattern: /^[0-9]+$/,
                    message: 'Solo números',
                },
            ]"
        >
            <a-input placeholder='Stock' v-model:value="formState.stock"></a-input>
        </a-form-item>
        <a-form-item
            name="price"
            label="Precio"
            :rules="[
                {
                    required: true,
                    whitespace: false,
                    pattern: /^[0-9]+$/,
                    message: 'Valor sin puntos ni comas',
                },
            ]"
        >
            <a-input placeholder='Precio' v-model:value="formState.price"></a-input>
        </a-form-item>
        <a-form-item
            name="description"
            label="Descripcion"
            :rules="[
                {
                    required: true,
                    whitespace: true,
                    pattern: /^.{1,100}$/,
                    message: 'Valor sin puntos ni comas',
                },
            ]"
        >
        <a-input placeholder='Descripcion' v-model:value="formState.description"></a-input>
    </a-form-item>
    <a-form-item
        name="cateogories"
        label="Catergorias" 
        >
        <a-select
            v-model:value="formState.categories"
            :options="options"
            mode="multiple"
            placeholder="Selecciona una o más categorías"
            style="width: 100%"
            @popupScroll="popupScroll"
        ></a-select>
    </a-form-item>
        <a-form-item>
            <a-button
                type="primary"
                html-type="submit"
                :loading="databaseStore.loading"
                :disabled="databaseStore.loading"
                block
            >
                CREAR CATEGORÍA</a-button
            >
        </a-form-item>
    </a-form>
</template>
