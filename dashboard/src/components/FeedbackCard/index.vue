<template>
    <div 
        @click="handleToggle"
        class="flex flex-col px-8 py-6 rounded cursor-pointer bg-brand-gray"
    >
        <div
            class="flex items-center justify-between w-full mb-8"
        >
            <Badge :type="feedback.type" />

            <span class="font-regular text-brand-graydark">
                {{ getDiffTimeBetweenCurrentDate(feedback.createdAt) }}
            </span>
        </div>

        <div class="text-lg font-medium text-gray-800">
            {{ feedback.text }}
        </div>

        <div
            :class="{animate__fadeOutUp: state.isClosing}"
            class="flex mt-8 animate__animated animate__fadeInUp animate__faseter"
            v-if="state.isOpen"
        >
            <div class="flex flex-col w-1/2">
                <div class="flex flex-col">
                    <span class="font-bold text-gray-400 uppercase select-none">Página</span>
                    <span class="font-medium text-gray-700">{{ feedback.page }}</span>
                </div>

                <div class="flex flex-col">
                    <span class="font-bold text-gray-400 uppercase select-none">Página</span>
                    <span class="font-medium text-gray-700">{{ feedback.device }}</span>
                </div>
            </div>

            <div class="flex flex-col w-1/2">
                <div class="flex flex-col">
                    <span class="font-bold text-gray-400 uppercase select-none">Página</span>
                    <span class="font-medium text-gray-700">{{ feedback.fingerprint }}</span>
                </div>
            </div>
        </div>
        
        <div class="flex justify-end mt-8" v-if="!state.isOpen">
            <Icon name="ChevronDown" size="24" :color="brandColors.graydark"/>
        </div>
    </div>
</template>

<script>
    import { reactive } from 'vue';
    import Badge from './Badge.vue';
    import { getDiffTimeBetweenCurrentDate } from '@/utils/date';
    import palette from '../../../palette';
    import Icon from '../Icon/index.vue';

    export default {
        components: { Badge, Icon },
        props: {
            isOpened: { type: Boolean, default: false },
            feedback: { type: Object, required: true }
        },
        setup(props) {
            const state = reactive({
                isOpen: props.isOpened,
                isClosing: !props.isOpened
            })

            const handleToggle = async () => {
                state.isClosing = true
                setTimeout(() => {}, 250)
                state.isOpen = !state.isOpen
                state.isClosing = false                
            };

            return {
                state,
                handleToggle,
                getDiffTimeBetweenCurrentDate,
                brandColors: palette.brand
            }
        },   
    }
</script>