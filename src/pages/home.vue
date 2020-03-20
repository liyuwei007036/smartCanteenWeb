<template>
    <div>
        欢迎光临
    </div>
</template>

<script>
    export default {
        name: "home",
        mounted() {
            this.goHome()
        },
        methods: {
            goHome() {
                this.$router.push({
                    path: '/consumerStatistics'
                })
            }
        }
    }
</script>

<style scoped>

</style>