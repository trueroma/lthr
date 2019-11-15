<template>
  <div class="card" v-if="filtered && (openedAsSimilar ? openedAsSimilar !== item.idx : true)">
    <div class="card-image waves-effect waves-block waves-light">
      <img class="activator" :src="item.pic" alt="leather piece">
    </div>
    <div class="card-content">
      <p class="card-title activator grey-text text-darken-4 item-name">{{ item.name }}<i class="material-icons right">more_vert</i></p>
      <p class="price" v-if="item.leather">Цена за дм.кв: {{ item.perDec }}₽</p>
      <p class="price" v-else>Цена: {{ item.price }}₽</p>
      <p>
        <router-link
            :to="toPath"
            class="btn-small red darken-1"
        >Подробнее</router-link>
      </p>
    </div>
    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">{{ item.name }}<i class="material-icons right">close</i></span>
      <ul>
        <li>
          Категории:<ol class="revealed-categories">
            <li v-for="bigCat of item.type.bigCat">{{ bigCat }}</li>
            <li v-for="underCat of item.type.underCat">{{ underCat }}</li>
          </ol>
        </li>
        <li>Страна производитель: {{ item.country }}</li>
        <li>Толщина кожины мм.: {{ item.thicc }}мм.</li>
        <li>В наличии: {{ quantity }}</li>
      </ul>
      <router-link
        :to="toPath"
        class="waves-effect waves-light btn-small red darken-1"
      >Открыть полностью</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      required: true,
      type: Object
    },
    openedAsSimilar: {
      required: true,
      type: Number
    },
    filter: {
      required: true,
      type: Array
    },
    searched: {
      required: false,
      type: String
    },

  },
  name: "card",
  data: () => ({
    toPath: '',
  }),
  created() {},
  mounted() {
    this.toPath = `/item/${this.item.idx}`;
  },
  computed: {
    quantity() {
      if (this.item.quantity.length > 1) {
        let biggest = 0;
        for (let i = 0; i < this.item.quantity.length; i++) {
          if (biggest < this.item.quantity[i]) biggest = this.item.quantity[i];
        }
        return biggest;
      } else {
        return this.item.quantity[0];
      }
    },
    filtered() {
      if (this.filter && !this.filter.length) return true;
      for (let i = 0; i < this.filter.length; i++) {
        for (let j = 0; j < this.item.type.bigCat.length; j++) {
          if (this.filter[i] === this.item.type.bigCat[j]) return true;
        }
        for (let j = 0; j < this.item.type.underCat.length; j++) {
          if (this.filter[i] === this.item.type.underCat[j]) return true;
        }

      }
    },

  },

};
</script>

<style scoped>
.card {
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-reveal ul li {
  margin: 1vw 0;
}
.price {
  margin-bottom: 1vw !important;
}
.card-title {
  hyphens: auto;
}
.revealed-categories {
  padding-left: 24px;
}

@media(max-width: 991px) {
  .card-content, .card-reveal {
    padding: 2.5vw;
  }
  .card-title {
    font-size: 18px !important;
    line-height: 1.5 !important;
    hyphens: auto;
  }
}
@media(max-width: 350px) {
  h1 {
    font-size: 1.8rem;
  }
  .card-title {
    font-size: 14px !important;
    line-height: 1.25 !important;
  }
  .card-reveal li {
    font-size: 12px !important;
  }
}
</style>