import { useLayoutEffect, MutableRefObject, useState } from 'react'

type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>

interface Size {
  width?: number
  height?: number
}

function useSize(target: BasicTarget): Size {
  const [width, setWidth] = useState(() => {
    const el = getTargetElement(target)
    return ((el || {}) as HTMLElement).clientWidth
  })
  const [height, setHeight] = useState(() => {
    const el = getTargetElement(target)
    return ((el || {}) as HTMLElement).clientHeight
  })

  useLayoutEffect(() => {
    const el = getTargetElement(target)
    if (!el) {
      return () => {}
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setWidth(entry.target.clientWidth)
        setHeight(entry.target.clientHeight)
      })
    })

    resizeObserver.observe(el as HTMLElement)
    return () => {
      resizeObserver.disconnect()
    }
  }, [target])

  return {
    width,
    height,
  }
}

export default useSize

type TargetElement = HTMLElement | Element | Document | Window

function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement
  }

  let targetElement: TargetElement | undefined | null

  if (typeof target === 'function') {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}
