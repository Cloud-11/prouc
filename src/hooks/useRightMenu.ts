//重置右键菜单
export const useRightMenu = (
  showsMenu: Function,
  setMenuPos: Function,
  hiddenMenu: Function
) => {
  const showRightMenu = (e: MouseEvent) => {
    e.preventDefault();
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
