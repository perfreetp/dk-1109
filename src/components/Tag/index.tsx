import React from 'react'
import { View } from '@tarojs/components'
import styles from './index.module.scss'

interface TagProps {
  children: React.ReactNode
  type?: 'primary' | 'success' | 'warning' | 'info'
  size?: 'small' | 'medium'
}

const Tag: React.FC<TagProps> = ({ children, type = 'primary', size = 'small' }) => {
  return (
    <View className={[styles.tag, styles[`tag-${type}`], styles[`tag-${size}`]].join(' ')}>
      {children}
    </View>
  )
}

export default Tag
