<template>
    <div class="flex justify-between" id="modal-create-account">
        <h1 class="text-4xl font-black text-gray-800">Criar uma conta</h1>

        <button 
            class="text-4xl text-gray-600 focus:outline-none"
            @click="close"
        >
            &times;
        </button>
    </div>

    <div class="mt-16">
        <form @submit.prevent="handleSubmit">
            <label class="block">
                <span class="text-lg font-medium text-gray-800">Nome</span>
                <input 
                    v-model="state.name.value"
                    type="text"
                    class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
                    :class="{
                        'border-brand-danger': !!state.name.errorMessage
                    }"
                    placeholder="Nome do usuário"
                >
                <span
                    v-if="!!state.name.errorMessage"
                    class="block font-medium text-brand-danger"
                >
                    {{ state.name.errorMessage }}
                </span>
            </label>
            
            <label class="block mt-9">
                <span class="text-lg font-medium text-gray-800">E-mail</span>
                <input 
                    v-model="state.email.value"
                    type="email"
                    class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
                    :class="{
                        'border-brand-danger': !!state.email.errorMessage
                    }"
                    placeholder="nome@gmail.com"
                >
                <span
                    v-if="!!state.email.errorMessage"
                    class="block font-medium text-brand-danger"
                >
                    {{ state.email.errorMessage }}
                </span>
            </label>

            <label class="block mt-9">
                <span class="text-lg font-medium text-gray-800">Senha</span>
                <input 
                    v-model="state.password.value"
                    type="password"
                    class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
                    :class="{
                        'border-brand-danger': !!state.password.errorMessage
                    }"
                    placeholder="Password"
                >
                <span
                    v-if="!!state.password.errorMessage"
                    class="block font-medium text-brand-danger"
                >
                    {{ state.password.errorMessage }}
                </span>
            </label>

            <button
                :disabled="state.isLoading"
                type="submit"
                :class="{
                    'opacity-50': state.isLoading
                }"
                class="px-8 py-3 mt-10 text-2xl font-bold text-white rounded-full bg-brand-main focus:outline-none transition-all duration-150"
            >
                <Icon v-if="state.isLoading" name="loading" class="animate-spin"/>
                <span v-else>Entrar</span>
            </button>
        </form>
    </div>
</template>

<script>
    import { reactive } from 'vue';
    import { useField } from 'vee-validate'
    import { useRouter } from 'vue-router';
    import { useToast } from 'vue-toastification'
    import useModal from '@/hooks/useModal';
    import Icon from '../Icon'
    import { validateEmptyAndLength3, validateEmptyAndEmail } from '../../utils/validators'
    import services from '../../services/index'

    export default {
        components: { Icon, Icon },
        setup() {
            const router = useRouter()
            const modal = useModal()
            const toast = useToast()

            const {
                value: nameValue,
                errorMessage: nameErrorMessage
            } = useField('password', validateEmptyAndLength3)

            const {
                value: emailValue,
                errorMessage: emailErrorMessage
            } = useField('email', validateEmptyAndEmail)

            const {
                value: passwordValue,
                errorMessage: passwordErrorMessage
            } = useField('password', validateEmptyAndLength3)

            const state = reactive({
                hasErrors: false,
                isLoading: false,
                name: {
                    value: nameValue,
                    errorMessage: nameErrorMessage
                },
                email: {
                    value: emailValue,
                    errorMessage: emailErrorMessage
                },
                password: {
                    value: passwordValue,
                    errorMessage: passwordErrorMessage
                },
            })

            const login = async ({ email, password }) => {
                const { data, errors } = await services.auth.login({ email, password })
                window.localStorage.setItem('token', data.token )
                state.isLoading = false
                router.push({ name: 'Feedbacks' })
                modal.close
            }

            const handleSubmit = async () => {
                try {
                    toast.clear()
                    state.isLoading = true
                    const { data } = await services.auth.register({
                        name: state.name.value,
                        email: state.email.value,
                        password: state.password.value
                    })

                    await login({ email: state.email.value, password: state.password.value})
                } catch (error) {
                    switch(error.response.status){
                        case 400:
                            toast.error('Erro na criação de conta')
                            break
                        default:
                            toast.error('Ocorreu um erro ao fazer o login')
                    }
                    state.isLoading = false
                    state.hasErrors = !!error
                }
            } 

            return {
                state,
                close: modal.close,
                handleSubmit
            }
        }
    }

</script>