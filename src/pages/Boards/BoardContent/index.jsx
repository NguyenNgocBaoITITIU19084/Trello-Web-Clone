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
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // function chung xử lý việc cập nhập lại state trong trường hợp di chuyển card giữa các column khác
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumn(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi mà ActiveCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      // phần này là logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      // phần này rất khó hiểu nên để nguyên như vậy không sửa tránh sai logic tính toán
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // clone mảng orderedColumnState cũ ra một cái mới để xử lý data r return - cập nhập lại OrderedColumnState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumns = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumns = nextColumns.find(column => column._id === overColumn._id)

      // column cũ
      if (nextActiveColumns) {
        // Xóa card ở cái column active (cũng có thể hiểu là column cũ, cái mà lúc kéo card ra khỏi nó để sáng colúnm khác)
        nextActiveColumns.cards = nextActiveColumns.cards.filter(card => card._id !== activeDraggingCardId)

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumns.cardOrderIds = nextActiveColumns.cards.map(card => card._id)
      }

      // column mới
      if (nextOverColumns) {

        // kiểm tra xem card đang kéo nó có tồn tại ở overColumn hay chưa, nếu có thì cần xóa nó trước
        nextOverColumns.cards = nextOverColumns.cards.filter(card => card._id !== activeDraggingCardId)

        // Đối với trường hợp DragEnd thì phải cập nhập lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumns._id
        }
        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumns.cards = nextOverColumns.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumns.cardOrderIds = nextOverColumns.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  // function tìm một cái column dựa trên cardId
  const findColumnByCardId = ( cardId ) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrederIds bời vì ở bước handleDragOver chúng ta sẽ
    // làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cái cardOrderIds mới.
    return orderedColumn.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // trigger khi bắt đầu kéo một phần tử
  const handleDragStart = ( event ) => {
    // console.log('handleDragStart:', event)
    // Tại một thời điểm chỉ có một card đang được kéo
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // nếu đang kéo card thì lưu giá trị của column chứa card đó
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // trigger trong quá trình kéo một phần tử (drag)
  const handleDragOver = ( event ) => {
    // kiểm tra xem nếu đang kéo column thì return luôn không làm gì cả
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // còn nếu là kéo card thì cần xử lý thêm logic để kéo qua lại giữa các column
    // console.log('handleDragOver:', event)
    const { active, over } = event

    // cần đảm bảo nếu không tồn tại active hoặc over (khi kéo thả ra khỏi phạm vi của container) thì không làm gì
    // tránh trường hợp crash trang
    if (!active || !over) return

    // activeDraggingCardId là cái card đang được kéo
    const { id: activeDraggingCardId, data : { current: activeDraggingCardData } } = active
    // overCardId là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên( activeDraggingCardId )
    const { id: overCardId } = over

    // Cần tìm 2 cái column chứa 2 cái cardId ở trên (activeDraggingCardId và overCardId)
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // kiểm tra nêu 1 trong 2 không tồn tại thì return tránh lỗi
    if (!activeColumn || !overColumn) return

    // xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì khong làm gì
    // Vì đây đang là đoạn xử lý logic lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vẫn đề khác
    if ( activeColumn._id !== overColumn._id ) {
      moveCardBetweenDifferentColumns (
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // trigger sau khi kéo một phần tử
  const handleDragEnd = ( event ) => {
    // console.log('handleDragEnd:', event)
    const { active, over } = event

    // cần đảm bảo nếu không tồn tại active hoặc over (khi kéo thả ra khỏi phạm vi của container) thì không làm gì
    // tránh trường hợp crash trang
    if (!active || !over) return

    // xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId là cái card đang được kéo
      const { id: activeDraggingCardId, data : { current: activeDraggingCardData } } = active
      // overCardId là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên( activeDraggingCardId )
      const { id: overCardId } = over

      // Cần tìm 2 cái column chứa 2 cái cardId ở trên (activeDraggingCardId và overCardId)
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // kiểm tra nêu 1 trong 2 không tồn tại thì return tránh lỗi
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa hai column khác nhau
      // Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào set từ bước handleDragStart ) chứ không 
      // phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state đã bị cập nhập một lần rùi
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns (
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // hành động kéo thả card trong cùng một column

        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // fin newColumnIndex in orderedColumn array
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // xắp xếp lại các vị trí card sau khi kéo thả
        const dndOrderedColumn = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumn(prevColumns => {
          // clone mảng orderedColumnState cũ ra một cái mới để xử lý data rồi return - cập nhập lại OrderedColumnState mới
          const nextColumns = cloneDeep(prevColumns)

          // Cần phải tìm tới columns mà chúng ta đang thả
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          // cập nhập lại orderedIds và cards trong nextColumns
          targetColumn.cards = dndOrderedColumn
          targetColumn.cardOrderIds = dndOrderedColumn.map(card => card._id)

          // trả về vị trí state mới chuẩn các vị trí sau khi kéo thả
          return nextColumns
        })
      }
    }

    // xử lý kéo thả column trong boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // neu vi tri keo khac voi vi tri ban dau
      if (active.id !== over.id) {
        // find old Column index in orderedColumn array
        const oldColumnIndex = orderedColumn.findIndex(c => c._id === active.id)
        // fin newColumnIndex in orderedColumn array
        const newColumnIndex = orderedColumn.findIndex(c => c._id === over.id)
        const dndOrderedColumn = arrayMove(orderedColumn, oldColumnIndex, newColumnIndex)
        setOrderedColumn(dndOrderedColumn)
      }
    }

    // những giá trị này sau khi kéo thả luôn phải đưa về giá trị null ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  return (
    // Content page
    <DndContext
      onDragStart={ handleDragStart }
      // Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì lúc này nó đang bị
      //  conflict, giữa card và column ), chúng ta sẽ dùng closetestCorners thay vi closetestCenter
      collisionDetection={ closestCorners }
      onDragOver={ handleDragOver }
      onDragEnd={ handleDragEnd }
      // video 30
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