<template>
  <ul
    class="sidenav"
    id="slide-out"
    ref="sidenavRoller"
  >
    <li>
      <div class="user-view">
        <div class="background">
          <img class="responsive-img" src="@/assets/pieces.jpg" alt="pieces">
        </div>

        <a href="#user"><img class="circle" src="@/assets/herb.png" alt="herb logo"></a>
        <a href="#name">
          <span class="white-text name" v-if="info.name">{{ info.name }}</span>
          <span class="white-text name" v-else>Ваше имя</span>
        </a>
        <a href="#email">
          <span class="white-text email" v-if="info.email">{{ info.email }}</span>
          <span class="white-text email" v-else>Ваша почта</span>
        </a>
      </div>
    </li>
    <li>
      <a href="tel:89313563757" class="black-text">
        <i class="material-icons left black-text">phone</i>+7 931 356 37 57
      </a>
    </li>
    <li>
      <a href="mailto:profkoza@gmail.com" class="black-text">
        <i class="material-icons left black-text">mail</i>Profkoza@gmail.com
      </a>
    </li>
    <li>
      <router-link to="/cart" class="black-text">
        <i class="material-icons left black-text">shopping_basket</i>Корзина
      </router-link>
    </li>
    <li v-if="info.name">
      <router-link to="/orders" class="black-text">
        <i class="material-icons black-text">flight_takeoff</i>Мои заказы
      </router-link>
    </li>
    <li v-else>
      <router-link to="/login" class="black-text">
        <i class="material-icons black-text">person</i>Войти
      </router-link>
    </li>
    <li v-if="info.name">
      <a href="#" @click.prevent="quit" class="black-text">
        <i class="material-icons left black-text">directions_run</i>Выйти
      </a>
    </li>
    <li v-else>
      <router-link to="/register" class="black-text">
        <i class="material-icons black-text">add</i>Регистрация
      </router-link>
    </li>
    <li>
      <router-link to="/about" class="black-text">
        <i class="material-icons left black-text">question_answer</i>О нас
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

const getters = ['info'];
const actions = ['logout'];

export default {
  name: "Sidenav",
  computed: {
    ...mapGetters(getters),

  },
  mounted() {
    this.sidenav = this.$refs.sidenavRoller;
    this.sidenav = M.Sidenav.init(this.sidenav, {});
  },
  beforeDestroy() {
    if (this.sidenav && this.sidenav.destroy) this.sidenav.destroy();
  },
  methods: {
    ...mapActions(actions),
    async quit() {
      await this.logout();
      this.$router.push('/login');
      M.toast({html: 'Вы вышли'});
    },

  }
};
</script>

<style scoped>
</style>