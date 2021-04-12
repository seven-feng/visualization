<template>
    <div>
        <el-input v-model="model" type="text" size="small"></el-input>
    </div>
</template>

<script>
export default {
    props: {
        model: {
            type: String,
            default: ''
        }
    }
}
</script>