import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css';
import LeftMenu from './components/leftMenu';
import RightContent from './components/rightContent';
import STYLES from './index.less';
const DashBoard: React.FC = () => {

  return(
    <div className={STYLES.wrap}>
        <div className={STYLES.content}>
          <SplitBox
            split="vertical"
            size={295}
            minSize={170}
            maxSize={295}
            primary="first">
            <div className={STYLES.left}>
              <LeftMenu />
            </div>
            <div className={STYLES.right}>
              <RightContent />
            </div>
          </SplitBox>
        </div>
      </div>
  )
}

export default DashBoard;