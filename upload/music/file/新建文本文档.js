/*
 * @Descripttion: 
 * @version: 
 * @Author: Remons
 * @Date: 2021-03-29 21:49:18
 * @LastEditors: Remons
 * @LastEditTime: 2021-03-29 21:57:57
 */
const anchor = [...document.querySelectorAll("")];
const titleArr = anchor.map((item, index) => ({
  text: item.name,
  nodeName: item.parentElement.localName,
  nodeNo: Number(item.parentElement.localName.replace(/h/g, "")),
  index,
}));

const nodeName = [...new Set(titleArr.map((item) => item.nodeNo))];

const newArr = nodeName.map((item) => ({ No: item, list: [] }));

titleArr.forEach((item) => {
  newArr.forEach((el) => {
    if (item.nodeNo === el.No) {
      el.list.push(item);
    }
  });
});

newArr.forEach((item) => {
  item.list.forEach((el, i) => {
    if (item.list[i + 1]) {
      el.children = titleArr.filter(
        (r) => r.index > el.index && r.index < item.list[i + 1].index
      );
    } else {
      el.children = titleArr.filter((r) => r.index > el.index);
    }
  });
});
