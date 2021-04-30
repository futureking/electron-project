import { Typography,Popover } from 'antd';
import gstyles from './param-panel.less';
import store from '@/stores';
import { observer } from 'mobx-react-lite';

const { Paragraph } = Typography;

interface ProjectProps {
  id: string;
}

const ProjectParam = observer((props: ProjectProps) => {
  const { id } = props;

  return (
    <>
      <div className={gstyles.title}>PROJECT</div>
      <ul>
        <li>
          <div className={gstyles.name}>Name:</div>
          <Paragraph
            editable={{ onChange: store.projectStore.projects.get(id)?.setName }}
            style={{ fontSize: 12, marginBottom: 0 }}
          >
            {store.projectStore.projects.get(id)?.name}
          </Paragraph>
        </li>
        <li>
          <div className={gstyles.name}>Type:</div>
          <div style={{ fontSize: 12 }}>{store.projectStore.projects.get(id)?.type}</div>
        </li>
        <li>
          <div className={gstyles.name}>URL:</div>
          <Popover content={store.projectStore.projects.get(id)?.url} trigger="hover">
          <div style={{ fontSize: 12, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{store.projectStore.projects.get(id)?.url}</div>
          </Popover>
        </li>
      </ul>
    </>
  );
});

export default ProjectParam;
