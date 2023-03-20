export const isPensjonsberegning = (
  data?: any
): data is PensjonsberegningResponse => {
  return (
    typeof data.alder === 'number' &&
    typeof data.pensjonsaar === 'number' &&
    typeof data.pensjonsbeloep === 'number'
  )
}
