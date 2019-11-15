<template>
  <Loader v-if="!loaded"/>
  <form v-else @submit.prevent="submitHandler">
    <h3>Вход</h3>
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
      <span>Войти</span>
    </button>
    <p class="center">
      Ещё нет аккаунта?
      <router-link to="/register">Зарегистрироваться</router-link>
    </p>
  </form>
</template>

<script>
import {email, required, minLength} from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

const actions = ['login'];

export default {
name: "login",
  data: () => ({
    loaded: false,
    email: '',
    password: '',
  }),
  validations: {
    email: {
      email,
      required
    },
    password: {
      minLength: minLength(6),
      required
    }
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
        password: this.password
      };

      try {
        await this.login(formData);
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