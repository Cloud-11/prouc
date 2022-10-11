import "./rightMenu.scss";
import { ElScrollbar, ElIcon } from "element-plus";
import { storeToRefs } from "pinia";
import {
  Copy,
  Clipboard,
  ToTopOne,
  ToBottomOne,
  Up,
  Down,
  Back,
  Delete,
} from "@icon-park/vue-next";
import { computed, defineComponent, onUnmounted } from "vue";
import { useRightMenuOptsStore, useRightMenuStore } from "@/stores";
import { RightMenu } from "@/configs/menusConfig";

export default defineComponent({
  components: {
    ElScrollbar,
    ElIcon,
    Copy,
    Clipboard,
    ToTopOne,
    ToBottomOne,
    Up,
    Down,
    Back,
    Delete,
  },
  setup() {
    const rightMenuOptsStore = useRightMenuOptsStore();
    const { menus } = storeToRefs(rightMenuOptsStore);
    // const { groupOpts, copyOpts, moveOpts, otherOpts } = menus.value; //as RightMenuOpts;
    const rightMenuStore = useRightMenuStore();
    //解构会失去响应式 所以使用storeToRefs
    const { showMenu, menuPos } = storeToRefs(rightMenuStore);
    const { hiddenMenu } = rightMenuStore;
    //清除右键菜单
    document.body.addEventListener("click", () => {
      hiddenMenu();
    });
    onUnmounted(() => {
      document.body.removeEventListener("click", hiddenMenu);
    });
    const menuStyle = computed(() => {
      return {
        top: menuPos.value.top + "px",
        left: menuPos.value.left + "px",
      };
    });

    const optsItems = (opts: RightMenu[] | undefined) =>
      opts?.map(item => (
        <li class="rightMenu-menu-item" onClick={(e: MouseEvent) => item.handler(e)}>
          <el-icon>{item.icon()}</el-icon>
          {item.label}
        </li>
      ));

    return () => (
      <div class="rightMenu-container" v-show={showMenu.value} style={menuStyle.value}>
        <el-scrollbar max-height="400px">
          <ul class="rightMenu-menu">
            {optsItems(menus.value.groupOpts)}
            {menus.value.copyOpts && menus.value.groupOpts ? (
              <div class="rightMenu-menu-divider"></div>
            ) : (
              ""
            )}
            {optsItems(menus.value.copyOpts)}
            {menus.value.copyOpts && menus.value.moveOpts ? (
              <div class="rightMenu-menu-divider"></div>
            ) : (
              ""
            )}
            {optsItems(menus.value.moveOpts)}
            {menus.value.otherOpts && menus.value.moveOpts ? (
              <div class="rightMenu-menu-divider"></div>
            ) : (
              ""
            )}
            {optsItems(menus.value.otherOpts)}
          </ul>
        </el-scrollbar>
      </div>
    );
  },
});
