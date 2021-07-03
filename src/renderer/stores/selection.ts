import { OPType } from '@/models';
import { types } from 'mobx-state-tree';

interface PasteProps {
  json: string;
  duration: number;
  src: 'copy' | 'cut'
  type: 'Event' | 'Group' | 'A2V';
}

const PasteInfo = types
  .model({
    json: types.string,
    duration: types.number,
    src: types.enumeration(['copy', 'cut']),
    type: types.enumeration(['Event', 'Group', 'A2V'])
  })

const Selection = types
  .model({
    tabid: types.string,
    focusType: types.enumeration(['Project', 'Group', 'A2V', 'Event', 'Background', 'Event-Repeat', 'Group-Repeat', 'A2V-Repeat', '']),
    focusid: types.string,
    indType: types.enumeration(['Pointer', 'Time']),
    isEditCurve: types.boolean,
    opType: types.optional(types.enumeration<OPType>(["Intensity", "Duration", "Position", "None"]), "None"),
    x: types.number,
    y: types.number,
    pasteObj: types.maybeNull(PasteInfo)
  })

  .actions(self => ({
    setPasteObj(data: PasteProps) {
      self.pasteObj = data;
    },
    changeTab(id: string) {
      self.tabid = id;
      self.indType = 'Pointer';
      this.clearOP();
    },
    selectRoot() {
      self.focusType = 'Project';
    },
    selectRepeat(parentType: string, id: string) {
      switch (parentType) {
        case 'Event':
          self.focusType = 'Event-Repeat';
          self.focusid = id;
          break;
        case 'Group':
          self.focusType = 'Group-Repeat';
          self.focusid = id;
          break;
        case 'A2V':
          self.focusType = 'A2V-Repeat';
          self.focusid = id;
          break;
      }
    },
    selectEvent(id: string) {
      self.focusType = 'Event';
      self.focusid = id;
    },
    selectGroup(id: string) {
      self.focusType = 'Group';
      self.focusid = id;
    },
    selectA2V(id: string) {
      self.focusType = 'A2V';
      self.focusid = id;
    },
    selectBG() {
      self.focusType = 'Background';
    },
    clear() {
      self.focusid = '';
      self.tabid = '';
      self.focusType = '';
      self.opType = 'None';
      self.x = 0;
      self.y = 0;
    },
    setOP(type: OPType, x: number = 0, y: number = 0) {
      self.opType = type;
      self.x = x;
      self.y = y;
    },
    clearOP() {
      self.opType = 'None';
      self.x = 0;
      self.y = 0;
    },
    setInd(type: 'Pointer' | 'Time') {
      self.indType = type;
    },
    setIsEditCurve(flag: boolean) {
      self.isEditCurve = flag;
    }
  }))

export { Selection };
