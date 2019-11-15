<template>
  <header class="navbar-fixed">
    <nav>
      <div class="nav-wrapper white">
        <router-link to="/" class="brand-logo center">
          <img class="responsive-img" src="@/assets/bullie.png" alt="best logotype ever">
        </router-link>

        <!-- can't see until mobile -->
        <a
          href="#"
          data-target="slide-out"
          class="sidenav-trigger black-text"
        >
          <i class="material-icons">menu</i>
        </a>
        <!-- can't see until mobile -->

        <ul class="left hide-on-med-and-down" id="phone-mail">
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
        </ul>
        <ul class="right hide-on-med-and-down">
          <li>
            <router-link to="/about" class="black-text">
              <i class="material-icons left black-text">question_answer</i>О нас
            </router-link>
          </li>
          <li>
            <a
              class="dropdown-trigger black-text"
              href="#"
              data-target="dropdown-account"
              ref="dropdown"
            >
              <i class="material-icons left black-text">person_outline</i>Профиль
            </a>
          </li>
          <li>
            <router-link to="/cart" class="black-text">
              <i class="material-icons left black-text">shopping_basket</i>Корзина
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

        <!-- i know repeating "ul" could be not really good for SEO, but it's in materialize documentation, so it suppose to be fine :D -->
    <ul
      id="dropdown-account"
      class="dropdown-content"
    >
      <li v-if="info.name">
        <router-link to="/orders" class="black-text">
          <i class="material-icons">flight_takeoff</i>Мои заказы
        </router-link>
      </li>
      <li v-else>
        <router-link to="/login" class="black-text">
          <i class="material-icons black-text">person</i>Войти
        </router-link>
      </li>
      <li class="divider"></li>
      <li v-if="info.name">
        <a href="#" class="black-text" @click.prevent="quit">
          <i class="material-icons left black-text">directions_run</i>Выйти
        </a>
      </li>
      <li v-else>
        <router-link to="/register" class="black-text">
          <i class="material-icons black-text">add</i>Регистрация
        </router-link>
      </li>
    </ul>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

const actions = ['logout'];
const getters = ['info'];

export default {
  name: "NavBar",
  data: () => ({
    dropdown: null,
    sidenav: null,
  }),
  computed: {
    ...mapGetters(getters),

  },
  mounted() {
    this.dropdown = this.$refs.dropdown;
    this.dropdown = M.Dropdown.init(this.dropdown, {
      coverTrigger: false, // Shows dropdown below the trigger
      constrainWidth: false, // Can be wider then dropdown initiator
      alignment: 'right',
      hover: true,
    });
  },
  beforeDestroy() {
    if (this.dropdown && this.dropdown.destroy) this.dropdown.destroy();
  },
  methods: {
    ...mapActions(actions),
    quit() {
      this.logout();
      this.$router.push('/login');
      M.toast({html: 'Вы вышли'});
    }
  }

};
</script>

<style scoped>
.brand-logo img {
  height: 75%;
}
.brand-logo {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
#dropdown-account {
  margin-top: 64px;
}
</style>
