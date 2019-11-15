<template>
  <Loader v-if="!loaded"/>
  <main v-else>
    <div class="block-wrapper" v-if="orders.nonCheckedOrders.length">
      <h2>Необработанные</h2>
      <div class="card-area">
        <OrderCard
          v-for="order in orders.nonCheckedOrders"
          :order="order"
          :key="order.id"
          @remove="rmFromOrders(order.idx)"
        />
      </div>
    </div>

    <div class="block-wrapper" v-if="orders.checkedOrders.length">
      <h2>Обработанные</h2>
      <div class="card-area">
        <OrderCard
          v-for="order in orders.checkedOrders"
          :order="order"
          :key="order.id"
        />
      </div>
    </div>

    <div class="block-wrapper" v-if="orders.deliveredOrders.length">
      <h2>Доставленные</h2>
      <div class="card-area">
        <OrderCard
          v-for="order in orders.deliveredOrders"
          :order="order"
          :key="order.id"
        />
      </div>
    </div>
  </main>
</template>

<script>
import OrderCard from "@/components/OrderCard"
import { mapGetters, mapActions } from 'vuex';

const getters = ['info','orders'];
const actions = ['fetchOrders', 'rmFromOrders'];

export default {
  name: "orders",
  data: () => ({
    loaded: false,
  }),
  computed: {
    ...mapGetters(getters),

  },
  created() {
    this.fetchOrders();
    this.loaded = true;
  },
  watch: {},
  methods: {
    ...mapActions(actions),

  },
  components: {
    OrderCard,

  },

}
</script>

<style scoped>
  main {
    padding: 64px 5vw;
    margin: -64px 0;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    background-color: #fff;
  }
  .card-area {
    display: grid;
    grid-gap: 1vw;
    grid-template-columns: repeat(2, 1fr);
    padding: 1vw 0 0;
    width: 100%;
  }
  .paginate-wrapper {
    position: absolute;
    bottom: 5%;
  }
  .block-wrapper {
    width: 100%;
  }
  h2 {
    text-align: left;
    width: 100%;
  }
  @media (max-width: 991px) {
    .card-area {
      grid-template-columns: repeat(1, 1fr);
    }
    h2 {
      font-size: 2.56rem;
    }
  }
  @media (max-width: 600px) {
    main {
      margin: -56px 0 !important;
      padding: 56px 5vw;
    }
  }
</style>