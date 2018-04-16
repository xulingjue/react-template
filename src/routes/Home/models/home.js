import { model } from 'nmodel';

export default model({
  namespace: 'home',

  state: {
    count: 0
  },

  effects: {
    increase ({ put, update, getState }) {
      // put({ type: 'increase' });
      const state = getState().home;
      update({ count: state.count + 1 });
    },

    increaseAsync ({ put }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          put({ type: 'increase' });
          resolve();
        }, 1000);
      });
    },

    decrease ({ put }) {
      put({ type: 'decrease' });
    }
  },

  reducers: {
    increase (state, action) {
      return {
        ...state,
        count: state.count + 1
      };
    },

    decrease (state) {
      return {
        ...state,
        count: state.count - 1
      };
    }
  }
});
