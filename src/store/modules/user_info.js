import { userMutations } from '../mutations/user_info'
import { userActions } from '../actions/user_info'

const user_info = {
    state: {
        id:0,
        phone:'',
        token:''
    },
    mutations: userMutations,
    actions: userActions
}

export default user_info
