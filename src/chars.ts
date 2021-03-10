// export default function chars(node: OneMatcherValue): void {
//   if (typeof node === 'string') {
//     return node;
//   } else {
//     if (Array.isArray(node)) {
//       return node.map(viewHelper);
//     } else {
//       return viewHelper(node);
//     }
//   }
// }

// function viewHelper(node: OneMatcherNode): string {
//   switch (node.tpe) {
//     case "headline":
//       return (node.value as string).toUpperCase();
//       break;
//     case "text":
//       return node.value as string;
//       break;
//     default: 
//       return `[Unknown type: ${node.tpe}]`;
//       break;
//   }
// }
