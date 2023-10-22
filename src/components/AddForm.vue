<script setup>
import { reactive } from "vue";
import { useDatabaseStore } from "../stores/database";
import { message } from "ant-design-vue";

const databaseStore = useDatabaseStore();

const formState = reactive({
    name: ""
});

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
    <a-form
        name="addform"
        autocomplete="off"
        layout="vertical"
        :model="formState"
        @finish="onFinish"
    >
        <a-form-item
            name="name"
            label="Ingrese el nombre de la categoría"
            :rules="[
                {
                    required: true,
                    whitespace: true,
                    pattern: /^.{1,30}$/,
                    message: 'Longitud máxima 30 caracteres',
                },
            ]"
        >
            <a-input v-model:value="formState.name"></a-input>
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
