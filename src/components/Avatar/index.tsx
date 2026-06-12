import React from 'react'
import { Image } from '@tarojs/components'
import styles from './index.module.scss'

interface AvatarProps {
  src: string
  size?: 'small' | 'medium' | 'large'
  hasBorder?: boolean
}

const Avatar: React.FC<AvatarProps> = ({ src, size = 'medium', hasBorder = false }) => {
  const sizeMap = {
    small: 64,
    medium: 88,
    large: 120
  }

  return (
    <Image
      className={[styles.avatar, styles[`avatar-${size}`], hasBorder && styles.hasBorder].filter(Boolean).join(' ')}
      src={src}
      mode="aspectFill"
    />
  )
}

export default Avatar
