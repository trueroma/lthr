import _ from 'lodash'

export default {
  data() {
    return {
      page: 1,
      pageSize: 12,
      pageCount: 0,
      allItems: [],
      itemsToShow: [],

    }
  },
  methods: {
    clickCallback(page) {
      this.page = page;
    },
    setupPagination(allItems) {
      this.allItems = _.chunk(allItems, this.pageSize);
      this.pageCount = _.size(this.allItems);
      this.itemsToShow = this.allItems[this.page - 1] || this.allItems[0];
    },

  }
}