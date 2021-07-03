import store from '@/stores';
import { observer } from 'mobx-react-lite';
import React from 'react';
import A2VParam from './a2v';
import BGParam from './background';
import EventParam from './event';
import GroupParam from './group';

import styles from './index.less';
import ProjectParam from './project';
import RepeatParam from './repeat';


const ParamPanel = observer(() => {
  return (
    <div className={styles.panel}>
      {(() => {
        switch (store.selection.focusType) {
          case 'Event': return <EventParam />
          case 'Group': return <GroupParam />
          case 'Project': return <ProjectParam />
          case 'Background': return <BGParam />
          case 'A2V': return <A2VParam />
          case 'Event-Repeat':
          case 'Group-Repeat':
          case 'A2V-Repeat':
            return <RepeatParam />
          default: return <div />
        }
      }
      )()}
    </div>
  );
});

export default ParamPanel;