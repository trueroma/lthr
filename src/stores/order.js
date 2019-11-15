import firebase from 'firebase/app';

export default {
  state: {
    orders: {},

  },
  mutations: {
    setOrders: (state, value) =>  state.orders = value,

  },
  actions: {
    async order({ dispatch, commit }, { inCart, comment }) {
      const userCleanInfo = await dispatch('getUid');

      const userInfo = {
        email: userCleanInfo.email,
        name: userCleanInfo.name,
        phone: userCleanInfo.phone,
        uid: userCleanInfo.uid,

      };

      const orderDetails = {
        orderList: inCart,
        comment,
        userInfo,
        deleted: false,
        delivered: false,
        checked: false,

      };

      try {
        // adding order to orders list
        const res = await firebase.database().ref('/orders').once('value');
        const orders = res.val();
        let orderId = 0;


        if (orders) orderId = orders.length;


        await firebase.database().ref(`/orders/${orderId}`).set(orderDetails);

        //adding order in user's order list
        const userRes = await firebase.database().ref(`/users/${userInfo.uid}/info/orders`).once('value');
        const userOrders = userRes.val();

        let userOrderId = 0;

        if (userOrders) userOrderId = userOrders.length;

        await firebase.database().ref(`/users/${userInfo.uid}/info/orders/${userOrderId}`).set(orderDetails);

        localStorage.setItem('local-cart-changes', '[]');
        await dispatch('fetchItems');
        dispatch('fetchCart');
      } catch (err) {
        commit('setError', err);
        throw err
      }
    },
    async fetchOrders({ commit, dispatch }) {
      const userInfo = await dispatch('getUid');
      try {
        const res = await firebase.database().ref('/orders').once('value');
        const orders = res.val();
        const orderList = orders.map((order, idx) => ({
          ...order,
          idx,

        }));
        const orderListFiltered = orderList.filter(order => !order.deleted && order.userInfo.uid === userInfo.uid);
        const nonCheckedOrders = orderListFiltered.filter(order => !order.checked);
        const checkedOrders = orderListFiltered.filter(order => order.checked && !order.delivered);
        const deliveredOrders = orderListFiltered.filter(order => order.delivered);

        const allOrders = {
            nonCheckedOrders,
            checkedOrders,
            deliveredOrders

        };

        commit('setOrders', allOrders);
      } catch (err) {
        commit('setError', err);
        throw err
      }

    },
    async rmFromOrders({ dispatch, commit }, orderId) {
      const check = confirm('Вы точно хотите удалить заказ?');
      if (!check) return;
      try {
        const checkedChecker = (await firebase.database().ref(`orders/${orderId}/checked`).once('value')).val(); // Мда, нэйминг это моё призвание
        if (!checkedChecker) await firebase.database().ref(`orders/${orderId}/deleted`).set(true);
        dispatch('fetchOrders');
        M.toast({ html: 'Заказ отменён' });
      } catch (err) {
        commit('setError', err);
        throw err
      }
    }

  },
  getters: {
    orders: state => state.orders,
  }

}