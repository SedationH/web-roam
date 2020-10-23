import { Reducer, Effect, Subscription } from 'umi'
import { getRemote, editRemote } from './service'

interface UserModelType {
  namespace: 'users'
  state: {}
  effects: {
    getRemote: Effect
    editRemote: Effect
  }
  reducers: {
    getList: Reducer
  }
  subscriptions: {
    setup: Subscription
  }
}

const userModel: UserModelType = {
  namespace: 'users',
  state: {},
  reducers: {
    getList(state, { payload }) {
      return {
        ...state,
        data: payload,
      }
    },
  },
  effects: {
    *getRemote(action, { put, call }) {
      const data = yield call(getRemote)
      yield put({
        type: 'getList',
        payload: data,
      })
    },
    *editRemote({ payload }, { call, put }) {
      yield call(editRemote, payload)
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'getRemote',
          })
        }
      })
    },
  },
}

export default userModel
