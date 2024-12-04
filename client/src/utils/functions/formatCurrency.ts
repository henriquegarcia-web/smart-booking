const formatCurrency = (value: number) => {
  const formattedCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

  return formattedCurrency
}

const formatByCurrency = (value: string) => {
  const numericValue = parseFloat(
    value.replace(/[^\d,.-]/g, '').replace(',', '.')
  )

  return numericValue
}

const formatTextToCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, '')
  const paddedValue = numericValue.padStart(value.length, '0')

  let formattedValue

  switch (paddedValue.length) {
    case 7:
      formattedValue = `${paddedValue.slice(0, 2)}.${paddedValue.slice(
        2,
        5
      )},${paddedValue.slice(5)}`
      break
    case 6:
      formattedValue = `${paddedValue.slice(0, 1)}.${paddedValue.slice(
        1,
        4
      )},${paddedValue.slice(4)}`
      break
    case 5:
      formattedValue = `${paddedValue.slice(0, 3)},${paddedValue.slice(3)}`
      break
    case 4:
      formattedValue = `${paddedValue.slice(0, 2)},${paddedValue.slice(2)}`
      break
    default:
      formattedValue = paddedValue
  }

  return `R$ ${formattedValue}`
}

export { formatCurrency, formatByCurrency, formatTextToCurrency }
