import { Commands, RightMenu, RightMenuOpts } from "@/configs/menusConfig";

export const useKeyDownEvent = (commands: Commands, rightMenuConfig: RightMenuOpts) => {
  const onKeyDown = (e: KeyboardEvent) => {
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
    console.log(keyboardName);
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
  const init = () => window.addEventListener("keydown", onKeyDown);
  const destory = () => window.removeEventListener("keydown", onKeyDown);
  return {
    init,
    destory,
  };
};
