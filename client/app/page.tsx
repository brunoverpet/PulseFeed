import { tuyau } from '@/app/utils/tuyau'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

export default async function Home() {
  const message = await tuyau.articles.$get()

  // if (!message.data || !message.data.articles.length) {
  //   return <div>No articles found</div>
  // }

  return (
    <div>
      {/*<SimpleEditor />*/}
      <SimpleEditor
      // onSave={async ({ json, html }) => {
      //   await tuyau.articles.$post({
      //     body: { contentJson: json, contentHtml: html },
      //   })
      // }}
      />

      {/*{message.data.articles.map((article) => (*/}
      {/*  <h1 key={article.id}>{article.data.title}</h1>*/}
      {/*))}*/}
    </div>
  )
}
