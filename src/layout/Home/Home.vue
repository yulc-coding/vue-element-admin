<template>
    <el-container>
        <el-aside width="200px">
            <SideBar/>
        </el-aside>
        <el-container>
            <el-header>
                <HeadBar/>
            </el-header>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
    import SideBar from "../../layout/SideBar/SideBar";

    export default {
        name: "Home",
        components: {SideBar}
    }
</script>

<style scoped></style>
