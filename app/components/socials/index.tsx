import { SocialButton } from './social-button'
import styles from './socials.module.css'
import { GitHub, Twitter, Mail, RSS } from '@components/icons'

const Socials = (props: Omit<React.HTMLProps<HTMLDivElement>, 'className'>) => {
  return (
    <div className={styles.socials} {...props}>
      <SocialButton
        href="https://github.com/Elitelord"
        icon={<GitHub strokeWidth={2} />}
        tooltip="GitHub"
      />
      <SocialButton
        href="mailto:sameeragarwal007@outlook.com"
        icon={<Mail strokeWidth={2} />}
        tooltip="Email"
      />
      <SocialButton
        href="/feed.xml"
        icon={<RSS strokeWidth={2} />}
        tooltip="RSS"
      />
      {/* <ThemeSwitcher /> */}
    </div>
  )
}

export default Socials
