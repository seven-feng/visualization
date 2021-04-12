<template>
    <div class="editor-container">
        <div class="left">
            <ul class="list">
                <li draggable="true" @dragstart="dragStart">
                    <test-button />
                </li>
            </ul>
        </div>
        <div class="mid" @dragover="dragover" @drop.prevent="drop">
            <div v-for="comp in preComps" :key="comp.compId" :id="comp.compId" :class="['draggable', comp.compId === activedId? 'comp-actived':'']" :style="comp.style" tabindex="0" @mousedown="mouseDown" @click="handleFocus(comp.compId)">
                <component :is="comp.compName" :models="comp.models"></component>
            </div>
        </div>
        <div class="right">
            <div v-for="prop in curComp.props" :key="prop.name">
                <div class="form-group">
                    <div class="form-group-label">{{ prop.name }}</div>
                    <component :is="prop.type" class="form-group-comp" :model="curComp.models[prop.name]"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import components from '@/components/list'
import formControls from '@/components/form'
import { v4 as uuidv4 } from 'uuid'
export default {
    components: {
        ...components,
        ...formControls
    },
    data() {
        return {
            activedId: ''
        }
    },
    computed: {
        preComps() {
            return this.$store.state.preComps
        },
        curComp() {
            if(this.activedId) {
                return this.$store.getters.getComp(this.activedId)
            }
            return []
        }
    },
    methods: {
        dragStart(e) {
            let inner_offset = {
                x: e.offsetX,
                y: e.offsetY
            }
            e.dataTransfer.setData('comp_name', 'TestButton')
            e.dataTransfer.setData('inner_offset', JSON.stringify(inner_offset))
        },
        dragover(e) {
            e.preventDefault()
        },
        drop(e) {
            // create component
            let comp_name = e.dataTransfer.getData('comp_name')
            let { props, models } = JSON.parse(JSON.stringify(require('../components/schemas/' + comp_name + '.json')))
            let info = {
                compId: uuidv4(),
                compName: comp_name,
                props: props,
                models: models,
                style: {
                    position: 'absolute'
                }
            }
            let inner_offset = JSON.parse(e.dataTransfer.getData('inner_offset'))
            info.models.x = e.offsetX - inner_offset.x
            info.models.y = e.offsetY - inner_offset.y
            info.style.transform = 'translate(' + info.models.x + 'px,' + info.models.y + 'px)'
            this.$store.commit('putComp', info)
            // get focus
            this.activedId = info.compId
            
        },
        mouseDown(e) {
            // debugger // eslint-disable-line
            let compId = e.currentTarget.id
            // get focus
            this.activedId = compId
            document.onmousemove = e => {
                let comp = this.$store.getters.getComp(compId)
                comp.models.x = (comp.models.x + e.movementX) < 0 ? 0: comp.models.x + e.movementX
                comp.models.y = (comp.models.y + e.movementY) < 0 ? 0: comp.models.y + e.movementY
                // comp.models.x += e.movementX
                // comp.models.y += e.movementY
                comp.style.transform = 'translate(' + comp.models.x + 'px,' + comp.models.y + 'px)'
                this.$store.commit('putComp', comp)
            }
            document.onmouseup = () => {
                document.onmousemove = null
                document.onmouseup = null
            }
        },
        handleFocus(compId) {
            // debugger // eslint-disable-line
            this.activedId = compId
            // 显示右侧面板
        }
    }
}
</script>

<style lang="scss" scoped>
.editor-container {
    height: 100%;
    display: flex;
}
.left {
    width: 300px;
    height: 100%;
    border-left: 1px solid #000;
}
.mid {
    position: relative;
    width: calc(100vw - 700px);
    height: 100vh;
    background-color: blue;
    .draggable {
        &:hover {
            box-shadow: 0 0 0 2px red;
        }
    }
}
.list {
    list-style: none;
    margin: 0;
    padding: 0;
}
.comp-actived {
    box-shadow: 0 0 0 2px red;
}
.right {
    width: 400px;
    // height: 100%; ?
    padding: 30px;
    // box-sizing: border-box;
}
.form-group {
    margin-bottom: 20px;
    &-label {
        width: 80px;
        margin-bottom: 5px;
    }
    &-comp {
        width: 100%;
    }
}
</style>