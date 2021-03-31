import { InitState } from './type';
//添加选拔对象
export const SET_STAFF_LIST = 'SET_STAFF_LIST';

export const initState :InitState = {
  staff_list: ''
};

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_STAFF_LIST:
      return {
        ...state,
        staff_list: action.payload
      };
    default:
      return state;
  }
};
