import { menusName } from "@/stores/menus";

//重置右键菜单
export const useRightMenu = (
  showsMenu: Function,
  setMenuPos: Function,
  hiddenMenu: Function,
  setMenus: Function
) => {
  const showRightMenu = (e: MouseEvent, name: menusName) => {
    e.preventDefault();
    e.stopPropagation();
    setMenus(name);
    showsMenu();
    setMenuPos({ top: e.pageY, left: e.pageX });
  };

  //隐藏右键菜单
  const hiddenRightMenu = () => {
    hiddenMenu();
  };
  return {
    showRightMenu,
    hiddenRightMenu,
  };
};
