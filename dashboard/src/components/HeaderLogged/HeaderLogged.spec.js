import { shallowMount } from "@vue/test-utils";
import { routes } from "@/router";
import HeaderLogged from '.'

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

const mockStore = { currentUser: {} }
jest.mock('../../hooks/useStore', () => {
    return () => mockStore
})

describe('<HeaderLogged/>', () => {
    it('Should render header logged correctly', async () => {
        router.push('/')
        await router.isReady()
        const wrapper = shallowMount(HeaderLogged, {
            global: {
                plugins: [ router ]
            }
        })
        expect(wrapper.html()).toMatchSnapshot()
    })

    it("Should render 3 dots when there's not user logged", async () => {
        router.push('/')
        await router.isReady()
        const wrapper = shallowMount(HeaderLogged, {
            global: {
                plugins: [ router ]
            }
        })

        const buttonLogout = wrapper.find('#logout-button')
        expect(buttonLogout.text()).toBe('...')
    })

    it('Should render user anem when there is user logged', async () => {
        router.push('/')
        await router.isReady()
        mockStore.currentUser.name = 'Gabriel'
        const wrapper = shallowMount(HeaderLogged, {
            global: {
                plugins: [ router ]
            }
        })

        const buttonLogout = wrapper.find('#logout-button')
        expect(buttonLogout.text()).toBe('Gabriel (sair)')
    })
})