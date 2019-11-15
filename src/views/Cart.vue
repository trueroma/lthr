<template>
  <Loader v-if="!loaded" />

  <main v-else-if="inCart.length">
    <transition name="fade">
      <div class="main-layout more">
        <div class="form-wrapper">
          <div class="items">
            <InCartItem
              v-for="(cartItem, index) of inCart"
              :cartItem="cartItem"
              :key="index"
            />
          </div>
          <form class="order-handler" @submit.prevent="orderThatShit">
            <div class="fixer">
              <h3>Итого</h3>
              <h6 class="total-price">Итоговая стоимость: {{ total }}₽</h6>
              <div class="login" v-if="!info.name">
                <div class="input-field">
                  <input
                    id="OrderName"
                    type="text"
                    v-model.trim="name"
                    :class="{invalid: ($v.name.$dirty && !$v.name.required)}"
                  >
                  <label for="OrderName">Ваше имя</label>
                  <small
                    class="helper-text red-text"
                    v-if="$v.name.$dirty && !$v.name.required"
                  >Введите ваше имя
                  </small>
                </div>

                <div class="input-field">
                  <input
                    id="phone"
                    type="number"
                    v-model.trim="phone"
                    :class="{invalid: ($v.phone.$dirty && !$v.phone.required)
                      || ($v.phone.$dirty && !$v.phone.minLength)}"
                  >
                  <label for="phone">Ваш телефон</label>
                  <small
                    class="helper-text red-text"
                    v-if="$v.phone.$dirty && !$v.phone.required"
                  >Введите ваш номер телефона
                  </small>
                  <small
                    class="helper-text red-text"
                    v-if="$v.phone.$dirty && !$v.phone.minLength"
                  >Введите ваш телефон полностью
                  </small>
                  <small
                    class="helper-text red-text"
                    v-if="$v.phone.$dirty && !$v.phone.maxLength"
                  >Уберите лишние символы
                  </small>
                </div>

                <div class="input-field">
                  <input
                    id="OrderEmail"
                    type="text"
                    v-model.trim="email"
                    :class="{invalid: ($v.email.$dirty && !$v.email.required)
                      || ($v.email.$dirty && !$v.email.email)}"
                  >
                  <label for="OrderEmail">Ваш email</label>
                  <small
                    class="helper-text red-text"
                    v-if="$v.email.$dirty && !$v.email.required"
                  >Введите email
                  </small>
                  <small
                    class="helper-text red-text"
                    v-else-if="$v.email.$dirty && !$v.email.email"
                  >Введите email корректно
                  </small>
                </div>

                <div class="input-field">
                  <input
                    id="OrderPassword"
                    type="text"
                    v-model.trim="password"
                    :class="{invalid: ($v.password.$dirty && !$v.password.required)
                      || ($v.password.$dirty && !$v.password.minLength)}"
                  >
                  <label for="OrderPassword">Пароль</label>
                  <small
                    class="helper-text red-text"
                    v-if="$v.password.$dirty && !$v.password.required"
                  >Придумайте пароль</small>
                  <small
                    class="helper-text red-text"
                    v-else-if="$v.password.$dirty && !$v.password.minLength"
                  >Пароль должен содержать минимум {{ $v.password.$params.minLength.min }} символов, вы ввели {{ password.length }}</small>
                </div>
              </div>
              <div class="input-field">
                <input
                  id="comment"
                  type="text"
                  v-model.trim="comment"
                >
                <label for="comment">Комментарий к заказу</label>
              </div>
              <div class="button-wrapper">
                <button
                  class="order-everything waves-effect btn-large red"
                  type="submit"
                >
                  <span class="orderThat">Оформить заказ</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </main>
  <main class="empty-cart" v-else>
    <transition name="fade">
      <div class="text-wrapper">
        <h2>Упс.. Кажется вы забыли что-то положить в корзину</h2>
        <router-link to="/" class="btn-large red shop-link">Перейти в магазин</router-link>
      </div>
    </transition>
  </main>
</template>

<script>
import { email, required, minLength, maxLength } from 'vuelidate/lib/validators';
import InCartItem from '@/components/InCartItem';
import { mapGetters, mapActions } from 'vuex';

const getters = ['inCart', 'info'];
const actions = ['fetchCart', 'order', 'register'];

export default {
    name: "cart",
    data: () => ({
      loaded: false,
      email: '',
      password: '',
      phone: '8',
      name: '',
      comment: '',
    }),
    watch: {
      phone(val) {
        if (val[0] !== '8') this.phone = '8' + this.phone;
      }
    },
    validations: {
      email: {
        email,
        required
      },
      password: {
        minLength: minLength(6),
        required
      },
      name: {
        required
      },
      phone: {
        minLength: minLength(11),
        maxLength: maxLength(11),
        required
      }

    },
    computed: {
      ...mapGetters(getters),
      total() {
        let total = 0;
        for (let i = 0; i < this.inCart.length; i++) {
          total += this.inCart[i].price;
        }
        return total;
      },

    },
    methods: {
      ...mapActions(actions),
      async orderThatShit() {
        if (!this.info.name) {
          if (this.$v.$invalid) {
            this.$v.$touch();
            return;
          }
        }

        if (!this.info.name) {
          const formData = {
            email: this.email,
            password: this.password,
            name: this.name,
            phone: this.phone,

          };

          try {
            await this.register(formData);
          } catch (err) {
            console.log(err);
          }
        }

        const data = {
          inCart: this.inCart,
          comment: this.comment,

        };

        try {
          await this.order(data);
          M.toast({html: 'Заказ отправлен'});
          this.$router.push('/orders');
        } catch (err) {
          console.log(err);
        }
      },
    },
    created() {
      this.fetchCart();
      this.loaded = true;
      scrollTo(0, 0);
      setTimeout(() => M.updateTextFields(), 0);
    },
    components: {
      InCartItem,

    }

}
</script>

<style scoped>
    main {
      min-height: 100vh;
      margin: -64px 0;
      padding: 1vw 5vw 0;
    }
    .text-wrapper {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .shop-link {
      margin: 3vw 0;
    }
    h2 {
      text-align: center;
      width: 70%;
    }
    .main-layout {
      margin-top: 64px;
      width: 100%;
    }
    h1 {
      margin: 0 !important;
    }
    .form-wrapper {
      display: flex;
    }
    .items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1vw;
      padding-bottom: 1vw;
    }
    .order-handler {
      min-width: 29.7vw;
    }
    .input-field {
      margin: 2vw 0;
    }
    .fixer {
      position: fixed;
      min-width: 29.7vw;
      max-height: 75vh;
      overflow: auto;
      padding: 1vw 2vw 0 4vw;
    }
    h3 {
      margin: 1vw 0 0;
    }
    h6, .divider {
      margin-bottom: 32px;
    }
    .empty-cart {
      height: 100vh;
      margin-top: -64px;
      padding: 0;
    }

    @media (max-width: 1480px) {
      .items {
        grid-template-columns: repeat(1, 1fr);
      }
    }
    @media (max-width: 816px) {
      main {
        padding-top: 5vw;
      }
      .form-wrapper {
        flex-direction: column;
      }
      .fixer {
        position: static;
        padding: 0 0 5vw;
        max-height: none;
      }
      .button-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      h2 {
        font-size: 2.56rem;
      }
    }
    @media (max-width: 600px) {
      .items {
        grid-gap: 1.5vw;
      }
    }
</style>