import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "./stores/user";
import { useDatabaseStore } from "./stores/database";

import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Perfil from "./views/Perfil.vue";
import NotFound from "./views/NotFound.vue";
import Categories from "./views/Categories.vue";
import EditarCategoria from "./views/NewCategorie.vue";
import Products from "./views/Products.vue";
import EditarProducto from "./views/NewProduct.vue";

const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await userStore.currentUser();
    if (user) {
        next();
    } else {
        next("/login");
    }
    userStore.loadingSession = false;
};

const redireccion = async (to, from, next) => {
    const databaseStore = useDatabaseStore();
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const name = await databaseStore.getURL(to.params.pathMatch[0]);
    const user = await userStore.currentUser();
    if (!name) {
        next();
        userStore.loadingSession = false;
    } else {
        window.location.href = name;
        userStore.loadingSession = true;
        next();
    }
};

const routes = [
    { path: "/", component: Home, beforeEnter: requireAuth, name: "home" },
    {
        path: "/perfil",
        component: Perfil,
        beforeEnter: requireAuth,
        name: "perfil",
    },
    {
        path: "/categorias",
        component: Categories,
        beforeEnter: requireAuth,
        name: "categories",
    },
    {
        path: "/crear-categoria",
        component: EditarCategoria,
        beforeEnter: requireAuth,
        name: "create-categorie", 
    },
    {
        path: "/editar-categoria/:id",
        component: EditarCategoria,
        beforeEnter: requireAuth,
        name: "edit-categorie", 
    },
    {
        path: "/productos",
        component: Products,
        beforeEnter: requireAuth,
        name: "products",
    },
    {
        path: "/crear-producto",
        component: EditarProducto,
        beforeEnter: requireAuth,
        name: "create-product", 
    },
    {
        path: "/editar-producto/:id",
        component: EditarProducto,
        beforeEnter: requireAuth,
        name: "edit-product", 
    },
    { path: "/login", component: Login, name: "login" },
    { path: "/register", component: Register, name: "register" },
    {
        path: "/:pathMatch(.*)*",
        component: NotFound,
        name: "404",
        beforeEnter: redireccion,
    },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

export default router;
