import firebase from 'firebase/app';

export default {
  state: {
    items: [],
    cartItems: [],
    parentCategory: [],
    childCategory: [],

  },
  mutations: {
    setItems: (state, value) => state.items = value,
    setCartItems: (state, value) => state.cartItems = value,
    addToCart: (state, { id, sizeId }) => {
      state.items[id].quantity[sizeId]--;
      state.items[id].cartCount[sizeId]++;
    },
    minusCart: (state, { id, sizeId }) => {
      state.items[id].quantity[sizeId]++;
      state.items[id].cartCount[sizeId]--;
    },
    rmFromCart: (state, { id, sizeId }) => {
      state.items[id].quantity[sizeId] += state.items[id].cartCount[sizeId];
      state.items[id].cartCount[sizeId] = 0;
    },
    editQuantity: (state, { num, id, sizeId }) => {
      state.items[id].quantity[sizeId] = state.items[id].quantity[sizeId] - num + state.items[id].cartCount[sizeId];
      state.items[id].cartCount[sizeId] = num;
    },
    reiteration: (state, id) => {
      state.items[id].quantity = [...state.items[id].quantity]; // vue-js are not able to parse array data, to this help it to reiterate the array
      state.items[id].cartCount = [...state.items[id].cartCount]; // vue-js are not able to parse array data, to this help it to reiterate the array
    },
    setCategories: (state, { parentCategory, childCategory }) => {
      state.parentCategory = parentCategory;
      state.childCategory = childCategory;
    },
  },
  actions: {
    toCart({ dispatch, commit, state }, { sizeId, itemId }) {
      const id = state.items.findIndex(item => item.idx === itemId);
      if (id === -1 || !state.items[id].quantity) return;
      commit('addToCart', { id, sizeId });
      commit('reiteration', id);
      dispatch('fetchCart');
      M.toast({html: 'Добавлено в корзину'});
    },
    minusCart({ dispatch, commit, state }, { sizeId, itemId }) {
      const id = state.items.findIndex(item => item.idx === itemId);
      if (id === -1 || !state.items[id].quantity && !state.items[itemId].quantity[sizeId]) return;
      commit('minusCart', { id, sizeId });
      commit('reiteration', id);
      dispatch('fetchCart');
      M.toast({html: 'Удалено из корзины'});
    },
    rmFromCart({ dispatch, commit, state }, { sizeId, itemId }) {
      const id = state.items.findIndex(item => item.idx === itemId);
      if (id === -1 || !state.items[id].quantity) return;
      commit('rmFromCart', { id, sizeId });
      commit('reiteration', id);
      dispatch('fetchCart');
      M.toast({html: 'Удалено из корзины'});
    },
    editQuantity({ dispatch, commit, state }, { num, sizeId, itemId }) {
      const id = state.items.findIndex(item => item.idx === itemId);
      if (id === -1 || !state.items[id].quantity) return;
      if (num > state.items[id].quantity[sizeId] + state.items[id].cartCount[sizeId]) return;
      commit('editQuantity', { num, id, sizeId });
      commit('reiteration', id);
      dispatch('fetchCart');
    },
    async fetchItems({ dispatch, commit }) {
      try {
        const res = await firebase.database().ref(`/items`).once('value');
        const items =  res.val();
        const goods = items.map((item, idx) => ({
          ...item,
          idx,
          cartCount: new Array(item.quantity.length).fill(0),

        }));

        const localChanges = JSON.parse(localStorage.getItem('local-cart-changes') || '[]');
        for (let i = 0; i < localChanges.length; i++) {
          for (let j = 0; j < localChanges[i].cartCount.length; j++) {
            if (goods[localChanges[i].itemId].quantity[j] >= localChanges[i].cartCount[j]) {
              goods[localChanges[i].itemId].quantity[j] -= localChanges[i].cartCount[j];
              goods[localChanges[i].itemId].cartCount[j] = localChanges[i].cartCount[j];
            } else {
              localChanges[i].cartCount[j] = 0;
            }
          }
        }
        localStorage.setItem('local-cart-changes', JSON.stringify(localChanges));

        commit('setItems', goods);
        dispatch('fetchCategories');
      } catch(err) {
        commit('setError', err);
        throw err
      }

    },
    fetchCart({ dispatch, commit, state }) {
      if (!state.items.length) {
        setTimeout(() => {
          dispatch('fetchCart');
        }, 200);
        return;
      }
      try {
        let localChanges = [];
        let localChangesIdx = 0;
        let goods = [];
        let idx = 0;
        state.items.forEach((item, id) => {
          item.cartCount.forEach((amount, i) => {
            if (amount) {
              goods[idx] = {
                name: item.name,
                color: item.color,
                quantity: item.cartCount[i],
                quanCountId: i,
                left: item.quantity[i],
                size: item.size ? item.size[i] : false,
                price: item.price ? item.price : item.perDec * item.size[i] * item.cartCount[i],
                pic: item.pic,
                id,

            };
            idx++;
            if (localChangesIdx === 0 || id !== localChanges[localChangesIdx - 1].itemId) {
                localChanges[localChangesIdx] = {
                  itemId: id,
                  cartCount: item.cartCount,

                };
                localChangesIdx++;
              }
            }

          });
        });
        localStorage.setItem('local-cart-changes', JSON.stringify(localChanges));
        commit('setCartItems', goods);
      } catch(err) {
        commit('setError', err);
        throw err
      }

    },
    fetchCategories({ dispatch, commit, state }) {
      if (!state.items.length) {
        setTimeout(() => {
          dispatch('fetchCart');
        }, 200);
        return;
      }

      try {
        // copying categories
        let bigCat = [];
        let underCat = [];
        state.items.forEach(item => {
          item.type.bigCat.forEach(cat => {
            bigCat.push(cat);
          });
          item.type.underCat.forEach(cat => {
            underCat.push(cat);
          });
        });

        // getting categories as a list
        let parentCategory = bigCat.filter((cat, i) => {
          return i === bigCat.indexOf(cat);
        });
        let childCategory = underCat.filter((cat, i) => {
          return i === underCat.indexOf(cat);
        });

        // adding a quantity of repeating cats to the list
        for (let i = 0; i < parentCategory.length; i++) {
        let quantity = 0;
          bigCat.forEach(el => {
            if (parentCategory[i] === el) quantity++;
          });
          parentCategory[i] = {
            name: parentCategory[i],
            quantity,

          }
        }
        for (let i = 0; i < childCategory.length; i++) {
          let quantity = 0;
          underCat.forEach(el => {
            if (childCategory[i] === el) quantity++;
          });
          childCategory[i] = {
            name: childCategory[i],
            quantity,

          }
        }

        commit('setCategories', { parentCategory, childCategory });

      } catch(err) {
        commit('setError', err);
        throw err
      }

    },

  },
  getters: {
    items: state => state.items,

    inCart: state => state.cartItems,

    parentCategory: state => state.parentCategory,

    childCategory: state => state.childCategory,

  }
};