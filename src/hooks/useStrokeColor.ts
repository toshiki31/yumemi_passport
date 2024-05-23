export const useStrokeColor = () => {
  const strokeColor = (index: number) => {
    const baseColor = parseInt('006796', 16)
    const newColor = baseColor + index * 1000
    return `#${newColor.toString(16).padStart(6, '0')}`
  }
  return strokeColor
}
