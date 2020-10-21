import { Reducer, Effect, Subscription } from 'umi'
import { getRemoteList } from './service'

interface UserModelType {
  namespace: 'users'
  state: {}
  effects: {
    getRemote: Effect
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
      const data = yield call(getRemoteList)
      yield put({
        type: 'getList',
        payload: data,
      })
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
