<template>
  <main class="wrong" v-if="id >= items.length">
    <h4 class="center">Такого товара не существует</h4>
    <router-link to="/" class="btn-flat">В магазин</router-link>
  </main>

  <Loader v-else-if="!loaded" />

  <main v-else-if="items.length" :class="{footerSliderController: !sliding, canBeSlided: hasSiblings}">
    <form>
      <div class="carousel-wrapper" v-if="item.twins.length > 1">
        <div class="carousel" ref="carousel">
          <a
            href="#"
            class="carousel-item"
            title="Нажмите для применения изменений"
            v-for="twin of item.twins"
            @click.prevent="swip(twin)"
            :key="twin"
          >
            <img :src="items[twin].pic" alt="leather-piece">
          </a>
        </div>
      </div>

      <div class="img-wrapper" v-else>
        <img :src="item.pic" alt="leather-piece">
      </div>

      <transition name="fade">
        <div class="item-info" v-if="!sliding">
          <p class="center color">Цвет: {{ item.color }}</p>
          <h1 class="center">{{ item.name }}</h1>

            <!--leather template-->
          <div class="leather-wrapper" v-if="item.leather">
            <div class="item-options">
              <p class="item-basic">
                <span v-if="quantity">В наличие шкуры от {{ smallestSize }}кв.дм.</span>
                <span v-if="item.size.length > 1"><b>{{ smallestPrice }}₽ – {{ biggestPrice }}₽</b></span>
                <span v-else><b>от {{ smallestPrice }}₽</b></span>
              </p>
              <p class="item-basic">
                <span v-if="size.size">Цена: {{ price }}₽</span>
                <span><b>{{ item.perDec }}₽ за кв.дм.</b></span>
              </p>
              <div class="input-field" id="search">
                <select ref="select" v-model="size">
                  <option value="" disabled selected>Выберите размер шкуры в кв.дм.</option>
                  <option v-for="(size, i) of item.size" :value="{idx: i, size}" :disabled="!item.quantity[i] && !item.cartCount[i]">{{ size }} кв.дм.</option>
                </select>
                <label>Выберите размер шкуры (кв.дм.)</label>
              </div>
              <div class="item-basic">
                <p class="leather-categories">Категории: <span v-for="bigCat of item.type.bigCat">{{ bigCat }}</span><span v-for="underCat of item.type.underCat">{{ underCat }}</span></p>
              </div>
              <div class="desc">
                <p v-for="desc of item.desc"><span class="desc-item">{{ desc }}</span></p>
              </div>
              <div class="button-wrapper">
                <button
                  type="submit"
                  class="waves-effect waves-light red btn-large"
                  :class="{disabled: !sizeIsNotPicked}"
                  @click.prevent="toCart({sizeId: size.idx, itemId: item.idx})"
                  v-if="!item.cartCount[size.idx]"
                >
                  <i class="material-icons left">shopping_basket</i>
                  <span>В корзину!</span>
                </button>
                <div class="after-cart-options" v-if="item.cartCount[size.idx]">
                  <div class="controls">
                    <p class="inCart">В корзине</p>
                    <button
                      @click.prevent="minusCart({sizeId: size.idx, itemId: item.idx})"
                      class="minus-cart btn-floating waves-effect red accent-2"
                    >
                      <span>-</span>
                    </button>
                    <p class="cart-count">{{ item.cartCount[size.idx] }}</p>
                    <button
                      @click.prevent="toCart({sizeId: size.idx, itemId: item.idx})"
                      class="plus-cart btn-floating waves-effect red accent-2"
                      :class="{disabled: !sizeIsNotPicked}"
                    >
                      <span>+</span>
                    </button>
                  </div>
                  <p>Ещё в наличии {{ item.quantity[size.idx] }}</p>
                  <button
                    @click.prevent="rmFromCart({sizeId: size.idx, itemId: item.idx})"
                    class="remove-from-cart btn-floating waves-effect red"
                  >
                    <span>×</span>
                  </button>
                  <router-link to="/cart" class="to-cart waves-effect">
                    <i class="material-icons">move_to_inbox</i>Перейти в корзину
                  </router-link>
                </div>
              </div>
            </div>
          </div>

            <!--non-leather template-->
          <div class="non-leather-wrapper" v-if="!item.leather">
            <div class="non-leather-item-options">
              <div class="non-leather-item-basic">
                <p class="categories">Категории: <span v-for="bigCat of item.type.bigCat">{{ bigCat }}, </span><span v-for="underCat of item.type.underCat">{{ underCat }}</span></p>
              </div>
              <div class="non-leather-item-basic">
                <p>Страна производитель: {{ item.country }}</p>
              </div>
              <div class="non-leather-item-basic">
                <p>В наличии: {{ item.quantity[0] }}шт.</p>
              </div>
              <div class="non-leather-item-basic">
                <span>Цена: {{ item.price }}₽</span>
              </div>
              <div class="non-leather-item-basic">
                <ul class="detail">
                  <li v-for="detail of item.details"><span>{{ detail }}</span></li>
                </ul>
              </div>
              <div class="desc">
                <p v-for="desc of item.desc"><span class="desc-item">{{ desc }}</span></p>
              </div>
              <div class="button-wrapper">
                <button
                  type="submit"
                  class="waves-effect waves-light red btn-large"
                  :class="{disabled: !sizeIsNotPicked}"
                  @click.prevent="toCart({sizeId: size.idx, itemId: item.idx})"
                  v-if="!item.cartCount[size.idx]"
                >
                  <i class="material-icons left">shopping_basket</i>
                  <span>В корзину!</span>
                </button>
                <div class="after-cart-options" v-if="item.cartCount[size.idx]">
                  <div class="controls">
                    <p class="inCart">В корзине</p>
                    <button
                      @click.prevent="minusCart({sizeId: size.idx, itemId: item.idx})"
                      class="minus-cart btn-floating waves-effect red accent-2"
                    >
                      <span>-</span>
                    </button>
                    <p class="cart-count">{{ item.cartCount[size.idx] }}</p>
                    <button
                      @click.prevent="toCart({sizeId: size.idx, itemId: item.idx})"
                      class="plus-cart btn-floating waves-effect red accent-2"
                      :class="{disabled: !sizeIsNotPicked}"
                    >
                      <span>+</span>
                    </button>
                  </div>
                  <p>Ещё в наличии {{ item.quantity[size.idx] }}</p>
                  <button
                    @click.prevent="rmFromCart({sizeId: size.idx, itemId: item.idx})"
                    class="remove-from-cart btn-floating waves-effect red"
                  >
                    <span>×</span>
                  </button>
                  <router-link to="/cart" class="to-cart waves-effect">
                    <i class="material-icons">move_to_inbox</i>Перейти в корзину
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </form>

    <transition name="fade">
      <div class="similar more" v-if="!sliding && hasSiblings">
        <h5>Похожие товары</h5>
        <div class="items">
          <CardItem
            v-for="item in items"
            :key="item.idx"
            :item="item"
            :openedAsSimilar="id"
            :filter="filter"
          />
        </div>
      </div>
    </transition>
  </main>
</template>

<script>
import CardItem from '@/components/CardItem';
import { mapGetters, mapActions } from 'vuex';

const getters = ['items','parentCategory'];
const actions = ['toCart', 'minusCart', 'rmFromCart'];

export default {
  name: "item",
  computed: {
    ...mapGetters(getters),
    price() {
      return this.size.size * this.item.perDec;
    },
    sizeIsNotPicked() {
      return this.item.quantity[this.size.idx];
    },
    filter() {
      let arr = [];
      let k = 0;
      for (let i = 0; i < this.item.type.bigCat.length; i++) {
        arr[k] = this.item.type.bigCat[i];
        k++;
      }
      for (let i = 0; i < this.item.type.underCat.length; i++) {
        arr[k] = this.item.type.underCat[i];
        k++;
      }
      return arr;
    },
    hasSiblings() {
      for (let i = 0; i < this.parentCategory.length; i++) {
        for (let j = 0; j < this.item.type.bigCat.length; j++) {
          if (this.parentCategory[i].name === this.item.type.bigCat[j]) return (this.parentCategory[i].quantity > 1);
        }
      }
    },
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
    }

  },
  components: {
    CardItem,
  },
  data: () => ({
    id: null,
    item: {},
    loaded: false,
    carousel: null,
    options: {
      coverTrigger: false, // Shows dropdown below the trigger
      constrainWidth: true, // Can be wider then dropdown initiator
    },
    size: {
      size: 0,
    },
    smallestSize: 0,
    biggestSize: 0,
    smallestPrice: 0,
    biggestPrice: 0,
    sliding: false,

  }),
  watch: {
    items(items) {
      this.id = +this.$route.params.id;
      this.item = items.find((i) => i.idx === this.id);
      if (!this.item.leather) this.size.idx = 0;
      if (this.item.leather) this.calculate();
      this.loaded = true;

      this.materialFeatures();

    },
    $route() {
      this.id = +this.$route.params.id;
      this.item = this.items.find((i) => i.idx === this.id);
      scrollTo(0, 0);

      if (this.item.leather) this.calculate();
      if (this.carousel && this.carousel.destroy) this.carousel.destroy();
      if (this.select && this.select.destroy) this.select.destroy();

      this.materialFeatures();
    },

  },
  created() {
    this.id = +this.$route.params.id;
    if (!this.items.length) return;
    this.item = this.items.find((i) => i.idx === this.id);
    if (!this.item.leather) this.size.idx = 0;
    this.loaded = true;
    scrollTo(0, 0);

    // calculating sizes & prices correctly
    if (this.item.leather) this.calculate();

  },
  mounted() {
    if (!this.items.length) return;
    this.materialFeatures();
  },
  beforeDestroy() {
    if (this.carousel && this.carousel.destroy) this.carousel.destroy();
    if (this.select && this.select.destroy) this.select.destroy();
  },
  methods: {
    ...mapActions(actions),
    swip(twin) {
      if (twin !== this.id) {
        scrollTo(0, 0);
        this.id = twin;
        this.sliding = true;
        //let the carousel animation finish
        setTimeout(() => {
          this.$router.push(`/item/${twin}`);
          this.sliding = false;
        }, 800);
      }
    },
    calculate() {
      this.biggestSize = this.smallestSize = this.item.size[0];
      // calculating biggest size
      for (let i = 1; i < this.item.size.length; i++) {
        if (this.item.size[i] > this.biggestSize) this.biggestSize = this.item.size[i];
      }
      // biggest price
      this.biggestPrice = this.biggestSize * this.item.perDec;

      // calculating smallest size
      for (let i = 1; i < this.item.size.length; i++) {
        if (this.item.size[i] < this.smallestSize) this.smallestSize = this.item.size[i];
      }

      // smallest price
      this.smallestPrice = this.smallestSize * this.item.perDec;
    },
    materialFeatures() {
      setTimeout(() => {
        const carousel = this.$refs.carousel;
        this.carousel = M.Carousel.init(carousel, {
          numVisible: 3
        });
        const select = this.$refs.select;
        this.select = M.FormSelect.init(select, {
          dropdownOptions: this.options
        })
      }, 0);
    },

  }
}
</script>

<style scoped>
  .wrong {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 15vw;
  }
  .canBeSlided {
    min-height: 101vh;
  }
  main {
    background-color: #fff;
    min-height: 100vh;
    margin-top: -64px;
    padding: 0 0 2.5vw;
  }
  .footerSliderController {
    margin-bottom: -64px;
  }
  form {
    width: 100%;
  }
  .img-wrapper {
    padding-top: 68px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-wrapper img {
    margin: 1vw;
    height: 300px;
    border-radius: 20px;
  }
  .item-info, .similar {
    padding: 0 5vw;
  }
  .carousel-item img {
    overflow: hidden !important;
    /*border-radius: 10% !important;*/
    border-radius: 20px;
  }
  .item-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1vw;
  }
  .item-options p, .button-wrapper, .after-cart-options {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .after-cart-options p {
    margin-left: 1vw;
    white-space: pre;
  }
  .item-basic {
    flex-direction: column;
  }
  #search {
    grid-column: 3 / 5;
  }
  h1 {
    margin-top: 0 !important;
  }

  /*AAAAAAAA*/
  .carousel-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .carousel {
    width: 870px;
    margin: 0 auto;
  }
  /*AAAAAAAA*/





  .carousel .carousel-item {
    width: 400px !important;
  }
  .button-wrapper {
    height: auto;
    margin: 2rem 0;
    grid-column: 1 / 5;
  }
  p {
    text-align: center;
    font-size: 16px;
  }
  span {
    font-size: 16px;
  }
  .items {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1vw;
    margin: 2rem 0;
  }

  .non-leather-item-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1vw;
  }
  .non-leather-item-basic {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .categories {
    text-align: left;
    width: 100%;
  }
  .detail {
    width: 100%;
    height: 100%;
    margin: 0;
  }
  .desc {
    grid-column: 2 / 5;
  }
  .desc p {
    margin: 0;
  }
  .desc-item {
    margin: .3rem 0;
  }
  .item-basic ul {
    text-align: center;
  }
  .leather-categories {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    width: auto;
    height: 100%;
  }
  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cart-count {
    margin: 0 !important;
  }
  .minus-cart, .plus-cart, .remove-from-cart {
    margin: 0 1vw;
    max-height: 30px;
    max-width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .minus-cart span, .plus-cart span, .remove-from-cart span{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
  }
  .to-cart {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .to-cart i {
    margin: 0 8px 0 0;
  }

  @media (max-width: 991px) {
    main {
      padding-bottom: 76px !important;
    }
    .carousel .carousel-item {
      width: 300px !important;
    }
    /*AAAAAAAA*/
    .carousel {
      width: 640px;
      margin: 0 auto;
    }
    /*AAAAAAAA*/
    .item-info {
      padding: 0 5vw;
    }
    .item-basic, #search, .desc, .button-wrapper {
      grid-column: 1 / 5;
    }
    .non-leather-item-basic:nth-child(1), .non-leather-item-basic:nth-child(3) {
      grid-column: 1 / 3;
    }
    .non-leather-item-basic:nth-child(2), .non-leather-item-basic:nth-child(4) {
      grid-column: 3 / 5;
    }
    .non-leather-item-basic:nth-child(5) {
      grid-column: 1 / 5;
    }
    .non-leather-item-basic:nth-child(5) ul {
      margin: 1rem 0;
    }
    .non-leather-item-basic, .categories {
      text-align: center;
    }
    .desc {
      margin-bottom: 1rem;
    }
    .after-cart-options {
      flex-direction: column;
      justify-content: space-between;
      max-width: 260px;
      min-height: 160px;
    }
    .after-cart-options p {
      margin: 0;
    }
    .button-wrapper {
      margin: 0;
    }
    .inCart {
      display: none !important;
    }
    .controls {
      /*width: 30vw;*/
      width: 100%;
      margin: 0;
      justify-content: space-around;
      align-items: center;
    }
    .leather-categories {
      flex-direction: column;
    }
    .similar {
      padding: 0 5vw;
    }
    .items {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    main {
      margin: -56px 0 !important;
      padding-bottom: 0;
    }
    .canBeSlided {
      padding-bottom: 56px !important;
    }
    .color {
      margin-top: 0;
    }
    h1 {
      font-size: 2.2rem;
      margin-bottom: 0 !important;
    }
    .item-options {
      display: grid;
      grid-gap: 1vw;
    }
    .item-basic:nth-child(1) {
      grid-column: 1 / 3;
    }
    .item-basic:nth-child(2) {
      grid-column: 3 / 5;
    }
    #search {
      grid-column: 1 / 5;
    }
    .after-cart-options {
      min-height: 120px;
    }
    .remove-from-cart {
      display: none;
    }
    .button-wrapper {
      height: auto;
    }
  }
  @media (max-width: 400px) {
    .carousel .carousel-item {
      width: 280px !important;
    }
    .carousel {
      width: 400px;
    }
  }
  @media (max-width: 350px) {
    .carousel .carousel-item {
      width: 230px !important;
    }
  }
</style>