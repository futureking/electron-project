import store from '@/stores';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ProjectType } from '../../models';
import { EventType } from '../../models/richtap';
import EventParam from './event-param';
import GroupParam from './group-param';

import styles from './param-panel.less';
import ProjectParam from './proj-param';


const ParamPanel = observer(() => {
  return (
    <div className={styles.panel}>
      {(() => {
        switch (store.selection.type) {
          case 'Event': return <EventParam />
          case 'Group': return <GroupParam />
          default: return <ProjectParam id={store.selection.pid} />
        }
      }
      )()}
    </div>
  );
});

export default ParamPanel;
