<template>
  <main>
    <div class="options">

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

      <div class="input-field" id="sort">
        <select ref="select" v-model.number="sort">
          <option value="0">Сначала новое</option>
          <option value="1">По возрастанию цены</option>
          <option value="2">По убыванию цены</option>
        </select>
        <label>Сортировать</label>
       </div>

      <div class="input-field" id="search">
        <input id="look_for" type="text" class="validate" v-model="searched">
        <label for="look_for">Поиск</label>
      </div>
    </div>

    <div class="items" :class="{more: (FiltredAndSortedItems.length < 13)}">
      <CardItem
        v-for="item in filteredItems"
        :key="item.idx"
        :item="item"
        :openedAsSimilar="0"
        :filter="filter"
        :searched="searched"
      />
    </div>

    <!-- ain't gonna find it in components this one is downloaded but improved by materialize -->
    <div class="paginate-wrapper" v-if="FiltredAndSortedItems.length > 12">
      <Paginate
        :page-count="pageCount"
        :click-handler="clickCallback"
        :prev-text="'<i class=\'material-icons\'>chevron_left</i>'"
        :next-text="'<i class=\'material-icons\'>chevron_right</i>'"
        :container-class="'pagination unselectable'"
        :page-class="'waves-effect'"
      />
    </div>
  </main>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'
import CardItem from '@/components/CardItem';

import { mapGetters, mapActions } from 'vuex';

const getters = ['items', 'parentCategory', 'childCategory'];
const actions = ['sorting'];

export default {
  name: "shop",
  mixins: [paginationMixin],
  data: () => ({
    select: null,
    selectMultiple: null,
    options: {
      coverTrigger: false, // Shows dropdown below the trigger
      constrainWidth: true, // Can be wider then dropdown initiator
    },
    filter: [],
    sort: 1,
    FiltredAndSortedItems: [],
    searched: '',

  }),
  computed: {
    ...mapGetters(getters),
    filteredItems() {
      let items = [], itemId = 0, filtered;

      for (let i = 0; i < this.items.length; i++) {
        filtered = false;

        let searched = this.items[i].name.toLowerCase().includes(this.searched.toLowerCase());

        // calculating if the item fits filters
        if (!this.filter.length) filtered = true; // if there is no filters at all
        for (let j = 0; j < this.filter.length; j++) {
          for (let k = 0; k < this.items[i].type.bigCat.length; k++) {
            if (this.filter[j] === this.items[i].type.bigCat[k]) filtered = true; // if there is a match in chosen filters then we are accepting it
          }
          for (let k = 0; k < this.items[i].type.underCat.length; k++) {
            if (this.filter[j] === this.items[i].type.underCat[k]) filtered = true; // if there is a match in chosen filters then we are accepting it
          }
        }


        if (filtered && searched) {
          items[itemId] = this.items[i];
          itemId++
        }

      }

      switch(this.sort) {
        case 0:
          items.sort((a, b) => (b.idx - a.idx));
          break;

        case 1:
          items.sort((a, b) => {
            // if (a.leather && b.leather) return (a.perDec - b.perDec);
            // if (a.leather && !b.leather) return (a.perDec - b.price);
            // if (!a.leather && b.leather) return (b.perDec - a.price);
            // else return (a.price - b.price);

            // things upstairs happens when you're not getting enough sleep, let it be here as a reminder
            return (a.leather ? a.perDec : a.price) - (b.leather ? b.perDec : b.price);
          });
          break;

        case 2:
          items.sort((a, b) => (b.leather ? b.perDec : b.price) - (a.leather ? a.perDec : a.price));
          break;
      }

      this.FiltredAndSortedItems = items;
      this.setupPagination(items);
      return this.allItems[this.page - 1] || this.allItems[0];
    },

  },
  components: {
    CardItem,
  },
  mounted() {
    this.select = this.$refs.select;
    this.selectMultiple = this.$refs.selectMultiple;
    this.select = M.FormSelect.init(this.select, { dropdownOptions: this.options });
    this.selectMultiple = M.FormSelect.init(this.selectMultiple, { dropdownOptions: this.options });
  },
  beforeDestroy() {
    if (this.select && this.select.destroy) this.select.destroy();
    if (this.selectMultiple && this.selectMultiple.destroy) this.selectMultiple.destroy();
  },
  watch: {
    page() {
      scrollTo(0, 0);
    }
  },
  methods: {
    ...mapActions(actions),

  }
};
</script>

<style scoped>
main {
  margin: -64px 0;
  padding: 2vw 5vw 0;
  min-height: 100vh;
}
.options {
  margin-top: 64px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1vw;
}
#search {
  grid-column: 3 / 5;
}
.items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1vw;
}
.paginate-wrapper {
  margin: 0 0 64px;
  padding: 1vw 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 991px) {
  .options {
    grid-template-rows: repeat(3, 1fr);
    margin: 2vw 0;
  }
  #filter, #sort, #search {
    grid-column: 1 / 5;
  }
  .items {
    grid-template-columns: repeat(2, 1fr);
  }
  .pagination {
    text-align: center;
  }
}
@media (max-width: 600px) {
  main {
    margin: 0 0 -56px;
  }
}
@media (max-width: 450px) {
  .pagination li a {
    font-size: 0.9rem !important;
  }
}
</style>