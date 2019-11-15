<template>
  <Loader v-if="!loaded"/>
  <div id="app" v-else>
    <NavBar />
    <SideNav />
    <router-view></router-view>
    <FootBar />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import SideNav from '@/components/SideNav'
import FootBar from '@/components/FootBar'
import { mapGetters, mapActions } from 'vuex';

const actions = ['fetchItems', 'getUid'];
const getters = ['info','error'];

export default {
  name: "app",
  data: () => ({
    loaded: false
  }),
  computed: {
    ...mapGetters(getters),
  },
  methods: {
    ...mapActions(actions),
  },
  async mounted() {
    await this.fetchItems();
    await this.getUid();
    this.loaded = true;
  },
  watch: {
    error(val) {
      console.log('unexpected error:', val);
      if (val.code === 'auth/wrong-password') M.toast({html: 'Неправильный пароль'});
      if (val.code === 'auth/user-not-found') M.toast({html: 'Неправильная почта'});
    }
  },
  components: {
    NavBar,
    SideNav,
    FootBar,

  }
};
</script>

<style lang="scss">
@import "~materialize-css/dist/css/materialize.min.css";
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
body {
  background-color: #efefef;
}
/*::-webkit-scrollbar {*/
/*  width: 0;*/
/*}*/
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;           
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.more { // global for footer margin
  padding-bottom: 1vw;
  margin-bottom: 64px;
}
</style>
