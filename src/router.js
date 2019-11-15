import Vue from "vue";
import Router from "vue-router";
import Shop from "./views/Shop.vue";
import Item from "./views/Item.vue";
import Cart from "./views/Cart.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Orders from "./views/Orders.vue"

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "shop",
      component: Shop
    },
    {
      path: "/item/:id",
      name: "item",
      component: Item
    },
    {
      path: "/cart",
      name: "cart",
      component: Cart
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/orders",
      name: "orders",
      component: Orders
    },

  ]
});
