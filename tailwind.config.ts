import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'blue-zodiac': {
          '50': '#f0f7fe',
          '100': '#deedfb',
          '200': '#c5e1f8',
          '300': '#9ccef4',
          '400': '#6eb1ec',
          '500': '#4c94e5',
          '600': '#3778d9',
          '700': '#2e64c7',
          '800': '#2b52a2',
          '900': '#284780',
          '950': '#192745',
        },
        'secondary': {
          '50': '#fbffe7',
          '100': '#f4ffc0',
          '200': '#edff85',
          '300': '#b29400',
          '400': '#b29400',
          '500': '#b29400',
          '600': '#d3c000',
          '700': '#b29400',
          '800': '#8a6c09',
          '900': '#75580e',
          '950': '#453003',
        },
        'primary-color': 'var(--primary-color)',
        'secondary-color': 'var(--secondary-color)',
        'accent-color': 'var(--accent-color)'
      }
    }
  }
}