/*
  Finding all the root compositions reachable from the
  current item, as there could be more than one root 
  because items can be refrenced by multiple compositions. 
  This is acheived by running a BFS upwards from the
  current item. 
*/

import { debug } from "../../utils/debugMessage";

export const getRootComps = () => {
  const activeItem = app.project.activeItem;

  if (!activeItem || !(activeItem instanceof CompItem)) {
    return null;
  }

  let queue = [activeItem];
  let roots: CompItem[] = [];

  while (queue.length > 0) {
    const item = queue.shift()!;

    debug(item.name);
    const parents = item.usedIn;
    if (parents.length === 0) {
      roots.push(item);
      debug("root: " + item?.name);
    }

    for (let i = 0; i < parents.length; i++) {
      queue.push(parents[i]);
    }
  }

  return roots;
};
