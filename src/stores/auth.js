import firebase from 'firebase/app'

export default {
  state: {
    info: {}
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
    clearInfo(state) {
      state.info = {};
    }
  },
  actions: {
    async login({dispatch, commit}, {email, password}) {
      try {
        const login = await firebase.auth().signInWithEmailAndPassword(email, password);
        const uid = login.user.uid;
        const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val();
        commit('setInfo', info);
      } catch (err) {
        commit('setError', err);
        throw err
      }
    },
    async register({dispatch, commit}, {email, password, name, phone}) {
      try {
        const login = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const uid = login.user.uid;
        const info = {
          name,
          phone,
          email,
          uid,

        };
        await firebase.database().ref(`/users/${uid}/info`).set(info);
        commit('setInfo', info);
      } catch (err) {
        commit('setError', err);
        throw err
      }
    },
    async getUid({commit}) {
      try {
        const user = await firebase.auth().currentUser;
        if (user) {
          const info = (await firebase.database().ref(`/users/${user.uid}/info`).once('value')).val();
          commit('setInfo', info);
          return info;
        }
      } catch(err) {
        commit('setError', err);
        throw err
      }

    },
    async logout({commit}) {
      await firebase.auth().signOut();
      commit('clearInfo');
    }

  },
  getters: {
    info: s => s.info
  }
}