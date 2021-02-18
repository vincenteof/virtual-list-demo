import { useState, useRef, MutableRefObject, useEffect, useMemo } from 'react'
import useSize from './useSize'
interface VirtualListOptions {
  itemHeight: number | ((index: number) => number)
  overScan?: number
}

function useVirtualList(list: any[], options: VirtualListOptions) {
  const containerRef = useRef<HTMLElement | null>(null)
  const { width, height } = useSize(
    containerRef as MutableRefObject<HTMLElement>
  )
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(10)
  const { itemHeight, overScan = 5 } = options

  const getOffset = (scrollTop: number) => {
    if (typeof itemHeight === 'number') {
      return Math.floor(scrollTop / itemHeight) + 1
    }
    let sum = 0
    let offset = 0
    for (let i = 0; i < list.length; i++) {
      const height = itemHeight(i)
      sum += height
      if (sum >= scrollTop) {
        offset = i
        break
      }
    }
    return offset + 1
  }

  const getViewCapacity = (containerHeight: number) => {
    if (typeof itemHeight === 'number') {
      return Math.ceil(containerHeight / itemHeight)
    }
    let sum = 0
    let capacity = 0
    for (let i = startIndex; i < list.length; i++) {
      const height = itemHeight(i)
      sum += height
      if (sum >= containerHeight) {
        capacity = i
        break
      }
    }
    return capacity - startIndex
  }

  const calculateRange = () => {
    const container = containerRef.current
    if (container) {
      const offset = getOffset(container.scrollTop)
      const viewCapacity = getViewCapacity(container.clientHeight)
      const from = offset - overScan
      const to = offset + viewCapacity + overScan
      setStartIndex(Math.max(from, 0))
      setEndIndex(Math.min(to, list.length))
    }
  }

  useEffect(() => {
    calculateRange()
  }, [width, height])

  const totalHeight = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return list.length * itemHeight
    }
    return list.reduce((sum, _, index) => sum + itemHeight(index), 0)
  }, [list.length, itemHeight])

  const getDistanceTop = (index: number) => {
    if (typeof itemHeight === 'number') {
      return index * itemHeight
    }
    return list.slice(0, index).reduce((sum, _, i) => sum + itemHeight(i), 0)
  }

  const scrollTo = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = getDistanceTop(index)
      calculateRange()
    }
  }

  const offsetTop = useMemo(() => getDistanceTop(startIndex), [startIndex])

  return {
    list: list.slice(startIndex, endIndex).map((ele, index) => ({
      data: ele,
      index: index + startIndex,
    })),
    scrollTo,
    containerProps: {
      ref: (ele: any) => {
        containerRef.current = ele
      },
      onScroll: (e: any) => {
        e.preventDefault()
        calculateRange()
      },
      style: { overflowY: 'auto' as const },
    },
    wrapperProps: {
      style: {
        width: '100%',
        height: totalHeight - offsetTop,
        marginTop: offsetTop,
      },
    },
  }
}

export default useVirtualList
