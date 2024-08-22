import Link from '@components/link'
import React from 'react'
import styles from './footer.module.css'

const PostFooter = () => {
  return (
    <>
      <hr style={{ margin: 0 }}/>
      <footer className={styles.footer}>
        <p>
          Thanks for reading! 
        </p>
      </footer>
    </>
  )
}

export default PostFooter
