// ------------------------------------
// constants
// ------------------------------------
export const MODULE = 'HOME';
export const INCREASE = `${MODULE}_INCREASE`;

// ------------------------------------
// actions
// ------------------------------------
export function increase() {
  return {
    type: INCREASE
  };
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [INCREASE]: (state) => {
    return Object.assign({}, state, {
      count: state.count + 1
    });
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  count: 0
};
export default function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
