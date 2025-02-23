import Box from '@mui/material/Box'
import Card from './ListCloumns/Column/ListCards/Card/Card'
import Column from './ListCloumns/Column/Column'
import ListColumns from './ListCloumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  // Ưu tiêu sử dụng 2 loại sensor này để kéo thả diễn ra trơn tru trên các thiết bị moblie
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumn, setOrderedColumn] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragStart = ( event ) => {
    // console.log('handleDragStart:', event)
    setActiveDragItemId(event?.active?.data?.current?._id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

  }

  const handleDragEnd = ( event ) => {
    // console.log('handleDragEnd:', event)
    const { active, over } = event

    // keo ra ngoai thi return luon tranh loi(keo linh tinh ra ngoai)
    if (!over) return

    // neu vi tri keo khac voi vi tri ban dau
    if (active.id !== over.id) {
      // find old index in orderedColumn array
      const oldIndex = orderedColumn.findIndex(c => c._id === active.id)
      // fin newIndex in orderedColumn array
      const newIndex = orderedColumn.findIndex(c => c._id === over.id)
      const dndOrderedColumn = arrayMove(orderedColumn, oldIndex, newIndex)
      setOrderedColumn(dndOrderedColumn)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)

  }

  return (
    // Content page
    <DndContext
      onDragStart={ handleDragStart }
      onDragEnd={ handleDragEnd }
      sensors={sensors}
    >
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
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/> }
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/> }

        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent