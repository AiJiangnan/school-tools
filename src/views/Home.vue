<template>
    <div>
        <a-layout>
            <a-layout-header style="color: white;">
                <h2 style="display: inline;">教学工具</h2>
            </a-layout-header>
            <a-layout>
                <a-layout-sider width="256px" theme="light" collapsible>
                    <a-menu class="menu" mode="inline" v-model:selectedKeys="state.selectedKeys"
                        :open-keys="state.openKeys" v-bind="{ onClick, onOpenChange, items }" />
                </a-layout-sider>
                <a-layout-content>
                    <div class="content">
                        <div class="pageView">
                            <router-view v-slot="{ Component }">
                                <keep-alive>
                                    <component :is="Component" />
                                </keep-alive>
                            </router-view>
                        </div>
                    </div>
                </a-layout-content>
            </a-layout>
            <a-layout-footer class="footer">
                copyright © 2024~{{ new Date().getFullYear() }} CodeArtist
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const state = reactive({ rootKeys: ['1', '2'], openKeys: [], selectedKeys: [] });

const items = reactive([
    {
        key: '1',
        // icon: () => h(PieChartOutlined),
        label: '成绩分析',
        title: '成绩分析',
        children: [
            {
                key: '/analyze',
                // icon: () => h(PieChartOutlined),
                label: '常规分析',
                title: '常规分析',
            },
        ]
    },
    {
        key: '2',
        label: '语文工具',
        title: '语文工具',
        children: [
            {
                key: '/pinyin',
                label: '拼音转换',
                title: '拼音转换',
            },
        ]
    },
])

function onOpenChange(openKeys) {
    const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);
    if (state.rootKeys.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys;
    } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
    }
}

function onClick({ item, key, keyPath }) {
    router.push(key)
}

watch(
    () => state.openKeys,
    (_val, oldVal) => {
        state.preOpenKeys = oldVal;
    },
);
</script>

<style scoped="scoped">
.menu {
    width: 256px;
    user-select: none;
}

.content {
    background-color: #eee;
    height: calc(100vh - 104px);
}

.pageView {
    background-color: white;
    padding: 20px;
    margin: auto 10px;
    height: calc(100vh - 100px);
    overflow-y: auto;
}

.footer {
    height: 40px;
    padding: 10px;
    text-align: center;
}
</style>