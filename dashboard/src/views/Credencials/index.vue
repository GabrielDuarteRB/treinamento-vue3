<template>
    <div class="flex justify-center w-full h-28 bg-brand-main">
        <HeaderLogged/>
    </div>

    <div class="flex flex-col items-center justify-center h-64 bg-brand-gray">
        <h1 class="text-4xl font-black text-center text-gray-800">Credenciais</h1>
        <p class="text-lg text-center text-gray-800 font-regular">
            Guia de instalação e geração de suas credenciais
        </p>
    </div>

    <div class="flex justify-center w-full h-full">
        <div class="flex flex-col items-center w-4/5 max-w6xl py-10">
            <h1 class="text-3xl font-black text-brand-darkgray">
                Instalação e configuração
            </h1>

            <p class="mt-10 text-lg text-center text-gray-800 font-regular">
                Este aqui é a sua chave de api
            </p>

            <contentLoader 
                v-if="store.Global.isLoading || state.isLoading"
                class="rounded"
                width="600px"
                height="50px"
            />            
            <div 
                v-else 
                class="flex py-3 pl-5 mt-2 justify-between rounded items-center bg-brand-gray w-full lg:w-1/2"
            >
                <span v-if="state.hasError">Erro ao carregar o script</span>
                <span v-else id="apiKey">{{ store.User.currentUser.apiKey }}</span>
                <div class="flex ml-20 mr-5" >
                    <Icon
                        @click="handleCopy"
                        name="copy"
                        :color="brandColors.graydark"
                        size="24"
                        class="cursor-pointer"
                    />
                    <Icon
                        id="generate-apiKey"
                        @click="handleGenerateApiKey"
                        name="loading"
                        :color="brandColors.graydark"
                        size="24"
                        class="cursor-pointer ml-3"
                    />
                </div>
            </div>

            <p class="mt-5 text-lg text-center text-gray-800 font-regular">
                Coloque o script abaixo no seu site para começar a receber feedbacks
            </p>

            <ContentLoader 
                v-if="store.Global.isLoading || state.isLoading"
                class="rounded"
                width="600px"
                height="50px"
            />

            <div v-else class="py-3 pl-5 pr-20 mt-2 rounded bg-brand-gray w-3/4 overflow-x-scroll">
                <span v-if="state.hasError">Erro ao carregar o script</span>
                <pre v-else>&lt;script src="https://GabrielDuarteRB-feedbacker-widget.netlify.app?api_key={{store.User.currentUser.apiKey}}"&gt;&lt;/script&gt</pre>
            </div>
        </div>
    </div>
</template>

<script>
    import { reactive, watch } from 'vue';
    import { useToast } from 'vue-toastification';
    import HeaderLogged from '@/components/HeaderLogged/index.vue';
    import useStore from '@/hooks/useStore';
    import Icon from '@/components/Icon/index.vue';
    import palette from '../../../palette';
    import ContentLoader from '@/components/ContentLoader/index.vue';
    import services from '@/services';
    import { setApiKey } from '@/store/user';

    export default {
        name: 'credencials',
        components: { HeaderLogged, Icon, ContentLoader, ContentLoader },
        setup() {
            const store = useStore()
            const toast = useToast()
            const state = reactive({
                hasError: false,
                isLoading: false
            })

            watch(() => store.User.currentUser, () => {
                if(!store.User.currentUser.apiKey && !store.Global.isLoading) {
                    handleError(true)
                }
            })

            const handleError = (error) => {
                state.isLoading = false
                state.hasError = !!error
            }

            const handleGenerateApiKey = async () => {
                try {
                    state.isLoading = true
                    const { data } = await services.users.generateApiKey()

                    setApiKey(data.apiKey)
                    state.isLoading = false
                } catch (error) {
                    handleError(error)
                }
            }

            const handleCopy = async () => {
                toast.clear()
                try {
                    await navigator.clipboard.writeText(store.User.currentUser.apiKey)
                    toast.success('Copiado!')
                } catch (error) {
                    handleError(error)
                }
            }

            return {
                store,
                brandColors: palette.brand,
                handleGenerateApiKey,
                handleCopy,
                state
            }
        }

    }
</script>
