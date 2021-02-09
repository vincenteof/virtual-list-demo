import { useState, useRef, MutableRefObject, useEffect, useMemo } from 'react'
import useSize from './useSize'
interface VirtualListOptions {
  itemHeight: number
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
    return Math.floor(scrollTop / itemHeight) + 1
  }

  const getViewCapacity = (containerHeight: number) => {
    return Math.ceil(containerHeight / itemHeight)
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

  const totalHeight = useMemo(() => list.length * itemHeight, [
    list.length,
    itemHeight,
  ])

  const getDistanceTop = (index: number) => {
    const height = index * itemHeight
    return height
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
