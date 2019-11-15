import Vue from "vue";
import Vuelidate from "vuelidate"
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Paginate from 'vuejs-paginate'
import VuePhoneNumberInput from 'vue-phone-number-input';
import Loader from '@/components/Loader'
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.use(Vuelidate);
Vue.config.productionTip = false;
Vue.component('Paginate', Paginate);
Vue.component('Loader', Loader);
Vue.component('VuePhoneNumberInput', VuePhoneNumberInput);


const key = process.env.VUE_APP_KEY;

firebase.initializeApp({
  apiKey: key,
  authDomain: "shop-kozha.firebaseapp.com",
  databaseURL: "https://shop-kozha.firebaseio.com",
  projectId: "shop-kozha",
  storageBucket: "shop-kozha.appspot.com",
  messagingSenderId: "495403944932",
  appId: "1:495403944932:web:319baa100696ca713d15f1"
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (app) return;
  app = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});