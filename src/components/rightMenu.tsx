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
import { RightMenu, RightMenuOpts } from "@/utils/menusConfig";

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
    const { copyOpts, moveOpts, otherOpts } = menus.value as RightMenuOpts;
    const rightMenuStore = useRightMenuStore();
    //解构会失去响应式 所以使用storeToRefs
    const { showMenu, menuPos } = storeToRefs(rightMenuStore);
    const { hiddenMenu } = rightMenuStore;
    //清除右键菜单
    document.body.addEventListener("mousedown", hiddenMenu);
    onUnmounted(() => {
      document.body.removeEventListener("mousedown", hiddenMenu);
    });
    const menuStyle = computed(() => {
      return {
        top: menuPos.value.top + "px",
        left: menuPos.value.left + "px",
      };
    });

    const optsItems = (opts: RightMenu[]) =>
      opts.map(item => (
        <li
          class="rightMenu-menu-item"
          onClick={(e: MouseEvent) => {
            hiddenMenu();
            item.handler(e);
          }}>
          <el-icon>{item.icon()}</el-icon>
          {item.label}
        </li>
      ));

    return () => (
      <div class="rightMenu-container" v-show={showMenu.value} style={menuStyle.value}>
        <el-scrollbar max-height="400px">
          <ul class="rightMenu-menu">
            {optsItems(copyOpts)}
            {copyOpts && moveOpts ? <div class="rightMenu-menu-divider"></div> : ""}
            {optsItems(moveOpts)}
            {otherOpts && moveOpts ? <div class="rightMenu-menu-divider"></div> : ""}
            {optsItems(otherOpts)}
          </ul>
        </el-scrollbar>
      </div>
    );
  },
});
