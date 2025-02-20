import Box from '@mui/material/Box'

import ListColumns from './ListCloumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumn, setOrderedColumn] = useState([])

  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = ( event ) => {
    console.log('handleDragEnd:', event)
    const { active, over } = event

    // keo ra ngoai thi return luon tranh loi(keo linh tinh ra ngoai)
    if (!over) return

    if (active.id !== over.id) {
      // find old index in orderedColumn array
      const oldIndex = orderedColumn.findIndex(c => c._id === active.id)
      // fin newIndex in orderedColumn array
      const newIndex = orderedColumn.findIndex(c => c._id === over.id)
      const dndOrderedColumn = arrayMove(orderedColumn, oldIndex, newIndex)
      setOrderedColumn(dndOrderedColumn)
    }
  }

  return (
    // Content page
    <DndContext onDragEnd={ handleDragEnd } sensors={sensors}>
      <Box
        sx={{
          height: (theme) => theme.trello.boardContentHeight,
          width: 'full',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          display: 'flex',
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumn}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent