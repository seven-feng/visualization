<template>
    <div>
        <el-input v-model="model" size="small"></el-input>
    </div>
</template>

<script>
export default {
    props: {
        model: {
            type: Number
        }
    }
}
</script>