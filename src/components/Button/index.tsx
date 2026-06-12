import React from 'react'
import { View } from '@tarojs/components'
import styles from './index.module.scss'

interface ButtonProps {
  children: React.ReactNode
  type?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  size = 'medium',
  disabled = false,
  onClick
}) => {
  return (
    <View
      className={[styles.button, styles[`button-${type}`], styles[`button-${size}`], disabled && styles.disabled].filter(Boolean).join(' ')}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </View>
  )
}

export default Button
