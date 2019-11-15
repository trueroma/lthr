<template>
  <Loader v-if="!loaded"/>
    <form v-else @submit.prevent="submitHandler">
      <h3>Регистрация</h3>
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="name"
          :class="{invalid: ($v.name.$dirty && !$v.name.required)}"
        >
        <label for="name">Ваше имя</label>
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
          id="email"
          type="text"
          v-model.trim="email"
          :class="{invalid: ($v.email.$dirty && !$v.email.required)
            || ($v.email.$dirty && !$v.email.email)}"
        >
        <label for="email">Ваш email</label>
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
          id="password"
          type="password"
          v-model.trim="password"
          :class="{invalid: ($v.password.$dirty && !$v.password.required)
            || ($v.password.$dirty && !$v.password.minLength)}"
        >
        <label for="password">Ваш пароль</label>
        <small
          class="helper-text red-text"
          v-if="$v.password.$dirty && !$v.password.required"
        >Введите пароль</small>
        <small
          class="helper-text red-text"
          v-else-if="$v.password.$dirty && !$v.password.minLength"
        >Пароль должен содержать минимум {{ $v.password.$params.minLength.min }} символов, вы ввели {{ password.length }}</small>
      </div>
      <button type="submit" class="waves-effect waves-light red btn-small">
        <span>Регистрация</span>
      </button>
      <p class="center">
        Уже есть аккаунт?
        <router-link to="/login">Войти</router-link>
      </p>
    </form>
</template>

<script>
import {email, required, minLength, maxLength} from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

const actions = ['register'];

export default {
  name: "register",
  data: () => ({
    loaded: false,
    email: '',
    phone: '8',
    password: '',
    name: '',
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
  created() {
    setTimeout(() => M.updateTextFields(), 0);
  },
  mounted() {
    this.loaded = true;
  },
  methods: {
    ...mapActions(actions),
    async submitHandler() {
        if (this.$v.$invalid) {
          this.$v.$touch();
          return;
        }

        const formData = {
          email: this.email,
          password: this.password,
          name: this.name,
          phone: this.phone,

        };

        try {
          await this.register(formData);
          this.$router.push('/');
        } catch (err) {
            console.log(err);
        }
    },
  }
}
</script>

<style scoped>
  form {
    width: 100%;
    height: 100vh;
    margin-top: -64px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 40vw;
  }
  h3 {
    width: 100%;
    text-align: left;
  }
  .input-field {
    width: 100%;
  }

  @media (max-width: 992px) {
    form {
      padding: 0 5vw;
    }
  }
</style>