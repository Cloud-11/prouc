import { Commands, RightMenu, RightMenuOpts } from "@/configs/menusConfig";
import { menusName } from "@/stores/menus";

//重置右键菜单
export const useRightMenu = (
  showsMenu: () => void,
  setMenuPos: (value: { top: number; left: number }) => void,
  hiddenMenu: () => void,
  setMenus: (name: menusName) => void
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

export const useRegisterRightMenu = (
  commands: Commands,
  rightMenuConfig: RightMenuOpts
) => {
  const rightMenuKeyboard = (e: KeyboardEvent) => {
    //光标键盘事件被覆盖
    if ((e.target as HTMLElement).nodeName === "INPUT") return;

    const { ctrlKey, shiftKey, altKey, key } = e;
    const keyBoardStr = [];
    if (ctrlKey) {
      keyBoardStr.push("ctrl");
    } else if (shiftKey) {
      keyBoardStr.push("shift");
    } else if (altKey) {
      keyBoardStr.push("alt");
    }
    keyBoardStr.push(key);
    //快捷键
    const keyboardName = keyBoardStr.join("+");

    const configs = [
      ...(rightMenuConfig.copyOpts as RightMenu[]),
      ...(rightMenuConfig.groupOpts as RightMenu[]),
      ...(rightMenuConfig.moveOpts as RightMenu[]),
      ...(rightMenuConfig.otherOpts as RightMenu[]),
    ];

    configs.forEach((config: RightMenu) => {
      if (!config.keyboard) return;
      if (config.keyboard.includes(keyboardName)) {
        commands[config.name](e);
        e.preventDefault();
      }
    });
  };
  return { rightMenuKeyboard };
};
