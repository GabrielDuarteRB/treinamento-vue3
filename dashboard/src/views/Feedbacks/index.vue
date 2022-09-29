<template>
    <div class="flex justify-center w-full h-28 bg-brand-main">
        <HeaderLogged/>
    </div>

    <div class="flex flex-col items-center justify-center h-64 bg-brand-gray">
        <h1 class="text-4xl font-black text-center text-gray-800">Feedback</h1>
        <p class="text-lg text-center text-gray-800 font-regular">
            Detalhes de todos os feedbacks recebidos
        </p>
    </div>

    <div class="flex justify-center 2w-full pb-20">
        <div class="w-4/5 max-w-6xl py-10 grid grid-cols-4 gap-2">
            <div>
                <h1 class="text-3xl font-black text-brand-darkgray">Listagem</h1>
                <suspense>
                    <template #default>
                        <Filters @select="changeFeedbacksType" class="mt-8 animate__animated animate__fadeIn"/>
                    </template>
                    <template #fallback>
                        <FiltersLoading class="mt-8"/>
                    </template>
                </suspense>
            </div>
            <div class="px-10 pt-20 col-span-3">
                <p 
                    v-if="state.hasError"
                    class="text-lg text-center text-gray-800 font-regular"
                >
                    Aconteceu um erro ao carregar os feedbacks
                </p>
                <p 
                    v-if="!state.feedbacks.length && !state.isLoading"
                    class="text-lg text-center text-gray-800 font-regular"
                >
                    Ainda nenhum feedback recebido
                </p>

                <FeedbackCardLoading v-if="state.isLoading || state.isLoadingFeedbacks" />
                <FeedbackCard 
                    v-else 
                    v-for="(feedback, index) in state.feedbacks" 
                    :key="feedback.id"
                    :is-opened="index === 0"
                    :feedback="feedback"
                    class="mb-8"
                />
                <FeedbackCardLoading v-if="state.isLoadingMoreFeedbacks" />
            </div>
        </div>
    </div>
</template>

<script>
    import { onErrorCaptured, onMounted, onUnmounted, reactive } from "vue";
    import HeaderLogged from "@/components/HeaderLogged/index.vue";
    import Filters from "./Filters.vue";
    import FiltersLoading from "./FiltersLoading.vue";
    import services from "@/services";
    import FeedbackCard from "@/components/FeedbackCard/index.vue";
    import FeedbackCardLoading from "@/components/FeedbackCard/Loading.vue";
    
    export default {
        components: { HeaderLogged, Filters, FiltersLoading, FeedbackCard, FeedbackCardLoading },
        setup() {
            const state = reactive({
                isLoading: false,
                isLoadingFeedbacks: false,
                isLoadingMoreFeedbacks: false,
                feedbacks: [],
                currentFeedbackType: '',
                pagination: {
                    limit: 5,
                    offset: 0
                },
                hasError: false
            })

            const handleErrors = (error) => {
                state.isLoading = false
                state.isLoadingFeedbacks = false
                state.isLoadingMoreFeedbacks = false
                state.hasError = !!error
            }

            const fetchFeedbacks = async () => {
                try {
                    state.isLoading = true
                    const { data } = await services.feedbacks.getAll({
                        ...state.pagination,
                        type: state.currentFeedbackType
                    })

                    state.feedbacks = data.results
                    state.pagination = data.pagination
                    state.isLoading = false
                } catch (error) {
                    handleErrors(error)
                }
            }

            const changeFeedbacksType = async(type) => {
                try {
                    state.isLoadingFeedbacks = true
                    state.pagination.offset = 0
                    state.pagination.limit = 5
                    state.currentFeedbackType = type.label
                    const { data } = await services.feedbacks.getAll({
                        ...state.pagination,
                        type: state.currentFeedbackType
                    })

                    state.feedbacks = data.results
                    state.pagination = data.pagination
                    state.isLoadingFeedbacks = false
                } catch (error) {
                    handleErrors(error)
                }
            }

            onMounted(() => {
                fetchFeedbacks(),
                window.addEventListener('scroll', handleScroll, false)
            })

            onUnmounted(() => {
                window.removeEventListener('scroll', handleScroll, false)
            })

            const handleScroll = async () => {
                
                const isBottomOfWindow = Math.ceil(
                    document.documentElement.scrollTop + window.innerHeight
                ) >= document.documentElement.scrollHeight

                if (state.isLoading || state.isLoadingMoreFeedbacks) return
                if (!isBottomOfWindow) return
                if (state.feedbacks.length >= state.pagination.total) return

                try {
                    console.log('oi')
                    state.isLoadingMoreFeedbacks = true
                    const { data } = await services.feedbacks.getAll({
                        ...state.pagination,
                        type: state.currentFeedbackType,
                        offset: (state.pagination.offset + 5)
                    })

                    if(data.results.length) {
                        state.feedbacks.push(...data.results)
                    }

                    state.isLoadingMoreFeedbacks = false
                    state.pagination = data.pagination
                } catch (error) {
                    handleErrors(error)
                }
            }

            onErrorCaptured(handleErrors)

            return{
                state,
                changeFeedbacksType
            }
        }
    }

</script>