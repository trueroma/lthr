<template>
  <div class="card-wrapper">
    <div class="card darken-1" :class="cardColor">
      <div class="card-content white-text">
        <div
          @click.prevent="$emit('remove')"
          class="remove-from-orders btn-floating waves-effect white red-text"
          v-if="!order.checked"
        >
          <span class="remove">×</span>
        </div>
        <span class="card-title">Заказ номер #{{ order.idx }}</span>
        <ol class="items-list" v-if="!full">
          <li>{{ order.orderList[0].name }}<span v-if="order.orderList[0].size"> - размер {{ order.orderList[0].size }}кв.дм.</span> {{ order.orderList[0].price }}₽</li>
          <li v-if="order.orderList.length > 1">{{ order.orderList[1].name }}<span v-if="order.orderList.length > 2 && order.orderList[1].size">...</span><span v-else> {{ order.orderList[1].price }}₽</span> </li>
        </ol>
        <ol class="items-list" v-else>
          <li v-for="item in order.orderList">{{ item.name }}<span v-if="item.size"> - размер {{ item.size }}кв.дм.</span> {{ item.price }}₽</li>
        </ol>
      </div>
      <div class="card-action" @click="full = !full">
        <a href="#">{{ opener }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      required: true,
      type: Object,
    },

  },
  name: "OrderCard",
  data: () => ({
    full: false,

  }),
  computed: {
    cardColor() {
      if (!this.order.checked) return 'grey darken-3';
      if (this.order.checked && !this.order.delivered) return 'blue darken-3';
      return 'green darken-3';
    },
    opener() {
      if (this.full) return 'Свернуть';
      return 'Посмотреть полностью';
    }
  },
  created() {},

}
</script>

<style scoped>
  ol {
    margin: 0;
    width: 100%;
  }
  li {
    margin: .5vw 0;
  }
  .card, .items-list, .card-content, .card-wrapper {
    transition: all .4s !important;
  }
  .remove-from-orders {
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .remove-from-orders {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .card-action {
    cursor: pointer;
  }
</style>