import React from 'react'
import useVirtualList from '../../hooks/useVirtualList'
import { range } from 'lodash-es'
import './index.css'

function VirtualList() {
  const { list, containerProps, wrapperProps } = useVirtualList(
    range(0, 99999),
    { itemHeight: 60 }
  )

  return (
    <div {...containerProps} className="list-container">
      <div {...wrapperProps}>
        {list.map((ele) => (
          <div
            className="list-item"
            style={{
              height: 52,
              marginBottom: 8,
            }}
            key={ele.index}
          >
            Row: {ele.data}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualList
