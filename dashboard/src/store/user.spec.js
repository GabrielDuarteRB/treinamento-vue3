import useStore from '../hooks/useStore'
import { setCurrentUser, resetUserStore, setApiKey, cleanCurrentUser } from './user'

describe('UserStore', () => {

    let store;

    beforeEach(() => {
        store = useStore()
    })

    afterEach(() => {
        resetUserStore()
    })

    it('Should set current user', () => {
        setCurrentUser({ name: 'Gabriel' })
        expect(store.User.currentUser.name).toBe('Gabriel')
    })

    it('Should set api_key on current user', () => {
        setApiKey('123')
        expect(store.User.currentUser.apiKey).toBe('123')
    })

    it('Should clean current user', () => {
        setCurrentUser({ name: 'Gabriel' })
        expect(store.User.currentUser.name).toBe('Gabriel')
        cleanCurrentUser()
        expect(store.User.currentUser.name).toBeFalsy()
    })
})