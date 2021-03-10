import * as tt from './types';
import * as mt from './model';
import { Node, reducePlus } from './node';


function mrLeaf(rmv: tt.OneMatcherNode, mv: string): tt.Maybe<mt.ModelRef> {
  return mt.leafRefs[rmv.tpe as tt.LeafMatcherType](mv);
}

function mrBranch(rmv: tt.OneMatcherNode, children: Array<mt.ModelRef>): tt.Maybe<mt.ModelRef> {
  return mt.branchRefs[rmv.tpe as tt.BranchMatcherType](children);
}

function mrContent(children: Array<mt.ModelRef>): tt.Maybe<mt.ModelRef> {
  return children;
}


export function reducer(rmv: tt.OneMatcherValue,
                 mv: tt.OneMatcherValue,
                 children: Array<mt.ModelRef>): tt.Maybe<mt.ModelRef> {

  let cFlat = children.filter(Boolean) as Array<mt.ModelRef>;
  if (mv === 'root') {
    return cFlat[0];
  } else if (typeof mv === 'string') {
    if (typeof rmv === 'string') {
    } else if (Array.isArray(rmv)) {
    } else {
      return mrLeaf(rmv, mv);
    }
  } else if (Array.isArray(mv)) {
    if (typeof rmv === 'string') {
      if (rmv === 'rootroot') {
        return mrContent(cFlat);
      }
    } else if (Array.isArray(rmv)) {
    } else {
      return mrBranch(rmv, cFlat);
    }
  } else {
    // console.log(mv.tpe, cFlat);
    return cFlat[0];
  }
}
