import "./rightMenu.scss";
import { ElScrollbar, ElIcon } from "element-plus";
import { defineComponent } from "vue";
import { useRightMenuStore } from "@/stores/rightMenu";

export interface RightMenu {
  label: string;
  icon: () => void;
  handler: (e: MouseEvent) => void;
}

export default defineComponent({
  props: {
    items: { type: Object },
  },
  components: {
    ElScrollbar,
    ElIcon,
  },
  setup(props) {
    const items = props.items as RightMenu[];
    const { showMenu, hiddenMenu } = useRightMenuStore();
    console.log(showMenu);

    return () => (
      <div class="rightMenu-container" v-show={showMenu}>
        <el-scrollbar max-height="400px">
          <ul class="rightMenu-menu">
            {items.map(item => (
              <li
                class="rightMenu-menu-item"
                onClick={(e: MouseEvent) => {
                  hiddenMenu();
                  item.handler(e);
                }}>
                <el-icon>{item.icon()}</el-icon>
                {item.label}
              </li>
            ))}
          </ul>
        </el-scrollbar>
      </div>
    );
  },
});
function useCounterStore() {
  throw new Error("Function not implemented.");
}
