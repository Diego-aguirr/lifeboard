import { useParams } from 'react-router'

export default function Board() {
  const { boardId } = useParams<{ boardId: string }>()

  return (
    <div>
      <h1>Tablero: {boardId}</h1>
    </div>
  )
}
