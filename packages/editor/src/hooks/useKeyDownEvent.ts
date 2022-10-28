export const useKeyDownEvent = () => {
  let keyDownList: Function[] = [];
  let keyUpList: Function[] = [];
  const onKeyDown = (e: KeyboardEvent) => {
    keyDownList.forEach(cb => cb(e));
  };
  const onKeyUp = () => {
    keyUpList.forEach(cb => cb());
  };

  const init = () => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  };
  const destory = () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
  const registerKeyboard = (keyd: Function, keyu?: Function) => {
    keyd && keyDownList.push(keyd);
    keyu && keyUpList.push(keyu);
  };
  return {
    init,
    destory,
    registerKeyboard,
  };
};
