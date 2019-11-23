<template>
  <div class="input-field" id="sort">
    <select ref="select" v-model.number="sort">
      <option value="0">Сначала новое</option>
      <option value="1">По возрастанию цены</option>
      <option value="2">По убыванию цены</option>
    </select>
    <label>Сортировать</label>
  </div>
</template>

<script>
export default {
  name: "sortItems",
  data: () => ({
    sort: 1,
    select: null,
    options: {
      coverTrigger: false, // Shows dropdown below the trigger
      constrainWidth: true, // Can be wider then dropdown initiator
    },
  }),
  mounted() {
    this.select = this.$refs.select;
    this.select = M.FormSelect.init(this.select, { dropdownOptions: this.options });
  },
  beforeDestroy() {
    if (this.select && this.select.destroy) this.select.destroy();
  },
  watch: {
    sort(val) {
      this.$emit('change', val);
    }
  }
}
</script>

<style>
  @media (max-width: 991px) {
    #sort {
      grid-column: 1 / 5;
    }
  }
</style>