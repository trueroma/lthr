<template>
  <div class="card-wrapper">
    <div class="card horizontal">
      <router-link :to="toPath" target="_blank" class="card-image waves-effect waves-block waves-light">
        <div
          @click.prevent="rmFromCart({sizeId: cartItem.quanCountId, itemId: cartItem.id})"
          class="remove-from-cart btn-floating waves-effect white red-text"
        >
          <span class="remove">×</span>
        </div>
        <img :src="cartItem.pic" alt="leather-piece">
      </router-link>

      <div class="card-stacked">
        <div class="card-content">
          <span class="card-title" :title="cartItem.name">{{ cartItem.name }}</span>
          <p v-if="cartItem.size">Размер: {{ cartItem.size }}кв.дм.</p>
          <p class="price">Стоимость: {{ cartItem.price }}₽</p>
        </div>
        <div class="card-action">
          <div class="controls">
            <div class="button-wrapper">
              <div
                @click.prevent="minusCart({sizeId: cartItem.quanCountId, itemId: cartItem.id})"
                class="minus-cart btn-floating waves-effect red accent-2"
                :class="{disabled: cartItem.quantity === 1}"
              >
                <span>-</span>
              </div>
            </div>
            <span class="quantityChangeable">{{ cartItem.quantity }}</span>
            <div class="button-wrapper">
              <div
                @click.prevent="toCart({sizeId: cartItem.quanCountId, itemId: cartItem.id})"
                class="plus-cart btn-floating waves-effect red accent-2"
                :class="{disabled: !cartItem.left}"
              >
                <span>+</span>
              </div>
            </div>
          </div>
          <span class="left">Ещё в наличии {{ cartItem.left }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
const actions = ['toCart', 'minusCart', 'rmFromCart','editQuantity'];

export default {
  name: "inCartItem",
  data() {
    return {
      max: this.cartItem.left + this.cartItem.quantity,
    }
  },
  watch: {},
  props: {
    cartItem: {
      required: true,
      type: Object,
    },

  },
  computed: {
    toPath() {
      return `/item/${this.cartItem.id}`
    },

  },
  created() {},
  methods: {
    ...mapActions(actions),

  }
}
</script>

<style scoped>
.card {
  margin: 0;
}
.card-image {
  overflow: hidden;
}
.card-image img {
  width: auto !important;
}
.card-stacked {
  border-left: #efefef solid 1px;
}
.card-action {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: auto;
}
.controls {
  margin: .5vw 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 80%;
}
.card-title {
  hyphens: auto;
}
.card-action {
  padding: 8px;
}
.card-content {
  padding: 12px;
}
.minus-cart, .plus-cart, .remove-from-cart {
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.quantityChangeable, .left {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.button-wrapper {
  display: flex;
  align-items: center;
}
.button-wrapper:nth-child(1) {
  justify-content: flex-end;
  grid-column: 1 / 3;
}
.button-wrapper:nth-child(2) {
  justify-content: flex-start;
  grid-column: 4 / 6;
}
.left {
  grid-column: 1 / 6;
}
.remove-from-cart {
  position: absolute;
  top: 10px;
  left: 10px;
}

@media(max-width: 600px) {
  .card-title {
    font-size: 16px;
    line-height: 1.5 !important;
  }
  .card-content {
    font-size: 12px;
  }
}
</style>