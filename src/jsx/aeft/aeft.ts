type objType = {
  str1: string;
  str2: string;
};

var obj: objType = {
  str1: "hello",
  str2: "hi",
};

export const compFunc = () => {
  var firstComp = app.project.item(1);
  obj.str1 = String(firstComp.numLayers);
  obj.str2 = String(firstComp.layer(firstComp.numLayers).name);

  return obj;
};
