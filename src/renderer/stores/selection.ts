import {types} from 'mobx-state-tree';

const Selection = types
.model({
  pid: types.string,
  gid: types.string,
  eid: types.string,
  type: types.enumeration(['Event', 'Group', 'Project', '']),
})

.actions(self => ({
  setSelection(type: 'Event'|'Group'|'Project'|'', pid: string, id: string = '') {
    self.pid = pid;
    switch (type){
      case 'Event':
        self.eid = id;
        break;
      case 'Group':
        self.gid = id;
        break;
      default :
        self.eid = '';
        self.gid = '';
    }
    self.type = type;
  },
}))

export {Selection};
