export const calendarFormat = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  return `${year}-${month}-${day}`
}

export const yearMonthFormat = (date: Date) => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1)
  // return month as string name in spanish
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  return `${year}-${monthNames[month - 1]}`
}

export const formatCurrency = (value: number) => {
  return 'S/.' + value.toString()
}