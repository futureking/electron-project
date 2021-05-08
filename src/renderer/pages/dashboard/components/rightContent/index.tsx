import React from 'react';
import classnames from 'classnames';
import STYLES from './index.less';

const Data = [
  {
    id: 1,
    name: 'project1'
  },
  {
    id: 2,
    name: 'project2'
  },
  {
    id: 3,
    name: 'project3'
  },
  {
    id: 4,
    name: 'project4'
  },
  {
    id: 5,
    name: 'project5'
  },
  {
    id: 6,
    name: 'project5'
  }
]

const RightContent: React.FC = () => {
  return(
    <div className={STYLES.wrap}>
      <h3>Create New</h3>
      <div className={STYLES.recent}>
        <h4>Recent Files</h4>
        <div className={STYLES.projects}>
          <div className={STYLES.project}>
            <div className={classnames(STYLES.block, STYLES.add)}>
              <img src={require('../../imgs/add.svg')} />
            </div>
            <p>Project Name</p>
          </div>
          {
            Data.map(item => {
              return(
                <div className={STYLES.project} key={item.id}>
                  <div className={STYLES.block}></div>
                  <p>{item.name}</p>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className={STYLES.allTemplate}>
        <h4>All Templates</h4>
        <div className={STYLES.projects}>
          {
            Data.map(item => {
              return(
                <div className={STYLES.project} key={item.id}>
                  <div className={STYLES.block}></div>
                  <p>{item.name}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default RightContent;