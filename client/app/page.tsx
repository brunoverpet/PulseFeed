import { tuyau } from '@/app/utils/tuyau'

export default async function Home() {
  const message = await tuyau.test.$get()
  return (
    <div>
      <h1>{message.data.hello}</h1>
    </div>
  )
}
