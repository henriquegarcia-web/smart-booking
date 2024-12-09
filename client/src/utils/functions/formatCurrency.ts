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

const applyDiscount = (value, discount, withPercent = true) => {
  if (discount < 0 || discount > 7) {
    throw new Error('Percentual de desconto deve estar entre 0 e 7')
  }

  const first = value.replace('R$ ', '').replace('.', '').replace(',', '.')

  const incomingValue = parseFloat(first.slice(0, -2) + '.' + first.slice(-2))
  console.log(incomingValue)

  // if (typeof value === 'string') {
  //   incomingValue = parseFloat(
  //     value.replace('R$ ', '').replace('.', '').replace(',', '.')
  //   )
  //   // incomingValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'))
  // } else if (typeof value === 'number') {
  //   const formattedToString = value.toString()
  //   incomingValue =
  // } else {
  //   throw new Error('O valor deve ser uma string ou um número')
  // }

  const desconto = incomingValue * (discount / 100)
  const valorComDesconto = incomingValue - desconto

  const formattedValue = formatCurrency(valorComDesconto)
  if (withPercent)
    return `${formattedValue}${discount > 0 ? ` (${discount}%)` : ''}`
  return formattedValue
}

export { formatCurrency, formatByCurrency, applyDiscount, formatTextToCurrency }
