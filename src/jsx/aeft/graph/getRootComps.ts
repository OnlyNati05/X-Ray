/*
  Finding all the root compositions reachable from the
  current item, as there could be more than one root 
  because items can be refrenced by multiple different compositions. 
  This is acheived by running a BFS upwards from the
  current item. 
*/

import { debug } from "../../utils/debugMessage";

export const getRootComps = () => {
  const activeItem = app.project.activeItem;
  let queue = [activeItem];
  debug(app.project.activeItem?.name);

  while (queue) {
    let item = queue.shift();
  }
};
