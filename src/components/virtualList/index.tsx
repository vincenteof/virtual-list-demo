import React from 'react'
import useVirtualList from '../../hooks/useVirtualList'
import { range } from 'lodash-es'
import './index.css'

function VirtualList() {
  const {
    list: list1,
    containerProps: containerProps1,
    wrapperProps: wrapperProps1,
  } = useVirtualList(range(0, 99999), { itemHeight: 60 })

  const {
    list: list2,
    containerProps: containerProps2,
    wrapperProps: wrapperProps2,
  } = useVirtualList(range(0, 99999), {
    itemHeight: (i) => (i % 2 === 0 ? 42 + 8 : 84 + 8),
  })

  return (
    <div className="list-wrapper">
      <div {...containerProps1} className="list-container1">
        <div {...wrapperProps1}>
          {list1.map((ele: any) => (
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
      <div {...containerProps2} className="list-container2">
        <div {...wrapperProps2}>
          {list2.map((ele: any) => (
            <div
              className="list-item"
              style={{
                height: ele.index % 2 === 0 ? 42 : 84,
                marginBottom: 8,
              }}
              key={ele.index}
            >
              Row: {ele.data}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualList
