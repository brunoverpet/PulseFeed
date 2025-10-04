import { tuyau } from '@/app/utils/tuyau'

export default async function Home() {
  const message = await tuyau.articles.$get()

  if (!message.data || !message.data.articles.length) {
    return <div>No articles found</div>
  }

  return (
    <div>
      {message.data.articles.map((article) => (
        <h1 key={article.id}>{article.data.title}</h1>
      ))}
    </div>
  )
}
