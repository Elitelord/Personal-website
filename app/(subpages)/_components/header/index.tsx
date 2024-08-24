import { PropsWithChildren } from 'react'

import styles from './header.module.css'
import ThemeSwitcher from '@components/theme-switcher'
import NavBar from '@components/navbar/navbar'

const Header = ({ children }: PropsWithChildren) => {
  return (<>
    <NavBar />
    <div className={styles.nav}>
      <div className={styles.header}>
        {children}
      </div>
      <div>
        <ThemeSwitcher hideTooltip />
      </div>
    </div>
    </>
  )
}

export default (Header)
