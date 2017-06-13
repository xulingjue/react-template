import React from 'react';
import styles from './MainLayout.less';

export const MainLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

export default MainLayout;

