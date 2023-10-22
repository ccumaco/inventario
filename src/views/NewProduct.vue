<script setup>
//set name component of FormProduct
import { reactive, ref } from "vue";
import { useDatabaseStore } from "../stores/database";
import { message } from "ant-design-vue";
import { useUserStore } from "../stores/user";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
databaseStore.getCategories()
const isEdit = ref(false);
const fileList = ref([]);
const route = useRoute();
const image = ref(null);
const options = databaseStore.documents.map((item, index) => {
  return {
    label: item.name,
    value: (index + 10).toString(36) + (index + 1),
  };
});
const objProduct = reactive({
    name: "testing",
    stock: "1",
    price: "3",
    description: "desc",
    available: true,
    categories: [],
});

const popupScroll = () => {
  console.log('popupScroll');
};

const createProduct = async (value) => {
  console.log(value.name, route.params.id);
  const error = await databaseStore.addProduct(value, image);
  console.log(error);
  if (!error) {
    return message.success("Producto creado correctamente");
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

const onFinish = async () => {
  const error = await userStore.updateUser(
    objProduct.name,
    fileList.value[0]
  );
  await createProduct(objProduct);

  if (!error) {
    return message.success("Se actualizó tu información displayName");
  }
  message.error("Ocurrió un error al actualizar el perfil");
};

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const beforeUpload = (file) => {
  return false;
};

const handleChange = (info) => {
  // validar los tipos de imágenes
  if (info.file.status !== "uploading") {
    // console.log(info.file);
    const isJpgOrPng =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Solo imagenes png o jpg");
      handleRemove(info.file);
      return;
    }
    const isLt2M = info.file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Máximo 2MB!");
      handleRemove(info.file);
      return;
    }
  }

  // valida que sea solo una imagen
  // si el user sube otra, se reemplazará
  let resFileList = [...info.fileList];
  resFileList = resFileList.slice(-1);
  resFileList = resFileList.map((file) => {
    if (file.response) {
      file.url = file.response.url;
    }
    return file;
  });
  fileList.value = resFileList;
};

</script>

<template>
  <div class="container-view">
    <div class="text-center mb-5" v-if="image">
      <a-avatar :src="image" :size="150"></a-avatar>
    </div>
    <a-form
        name="addform"
        autocomplete="off"
        layout="vertical"
        :model="objProduct"
        @finish="onFinish"
        >
        <a-upload
          v-model:file-list="image"
          list-type="picture"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <a-button class="mb-4">Subir fotodel producto</a-button>
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
            <a-input placeholder='Nombre' v-model:value="objProduct.name"></a-input>
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
            <a-input placeholder='Stock' v-model:value="objProduct.stock"></a-input>
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
            <a-input placeholder='Precio' v-model:value="objProduct.price"></a-input>
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
        <a-input placeholder='Descripcion' v-model:value="objProduct.description"></a-input>
    </a-form-item>
    <a-form-item
        name="cateogories"
        label="Catergorias" 
        >
        <a-select
            v-model:value="objProduct.categories"
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
                Crear producto</a-button
            >
        </a-form-item>
    </a-form>
  </div>
</template>
