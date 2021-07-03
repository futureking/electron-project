import { Typography } from 'antd';
import gstyles from '../index.less';
import store from '@/stores';
import { observer } from 'mobx-react-lite';
// import { toJS } from 'mobx';
// import { useEffect } from 'react';
const { Paragraph } = Typography;

// interface ProjectProps {
//   id: string;
// }

const ProjectParam = observer(() => {
  const project = store.current;
  const tab = store.currentTab;
  return (
    project ?
      <div>
        <div className={gstyles.title}>PROJECT</div>
        <div className={gstyles.name}>Name</div>
        <Paragraph
          editable={{ maxLength: 20, onChange: (value) => { project.setName(value); tab.updateRootName(value, project!.type) } }} 
          className={gstyles.context}
        >
          {project.name}
        </Paragraph>
        <div className={gstyles.name}>Type</div>
        <div className={gstyles.context}>{project.type}</div>
      </div>
      : <div />
  );
});

export default ProjectParam;