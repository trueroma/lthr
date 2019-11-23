<template>
  <div class="input-field" id="filter">
    <select multiple ref="selectMultiple" v-model="filter">
      <optgroup label="Основные категории">
        <option v-for="bigCat of parentCategory" :value="bigCat.name"><b>{{ bigCat.name }} ({{ bigCat.quantity }})</b></option>
      </optgroup>
      <optgroup label="Подкатегории">
        <option v-for="underCat of childCategory" :value="underCat.name">{{ underCat.name }} ({{ underCat.quantity }})</option>
      </optgroup>
    </select>
    <label>Фильтр</label>
  </div>
</template>

<script>
const getters = ['parentCategory', 'childCategory'];

import { mapGetters } from 'vuex';

export default {
  name: "FilterItems",
  data: () => ({
    filter: [],
    selectMultiple: null,
    options: {
      coverTrigger: false, // Shows dropdown below the trigger
      constrainWidth: true, // Can be wider then dropdown initiator
    },
  }),
  computed: {
    ...mapGetters(getters),
  },
  mounted() {
    this.selectMultiple = this.$refs.selectMultiple;
    this.selectMultiple = M.FormSelect.init(this.selectMultiple, { dropdownOptions: this.options });
  },
  beforeDestroy() {
    if (this.selectMultiple && this.selectMultiple.destroy) this.selectMultiple.destroy();
  },
  watch: {
    filter(val) {
      this.$emit('change', val);
    }
  }
}
</script>

<style scoped>
  @media (max-width: 991px) {
    #filter {
      grid-column: 1 / 5;
    }
  }
</style>