import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export type CreateArticleType = Infer<typeof createArticleValidator>

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(5).maxLength(255).trim(),
    slug: vine
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .minLength(5)
      .maxLength(255)
      .trim()
      .unique(async (db, value) => {
        const slug = await db.from('articles').where('slug', value).first()
        return !slug
      }),
    metaDescription: vine.string().minLength(5).maxLength(160).trim(),
    content: vine.string().minLength(20),
    images: vine
      .array(
        vine.object({
          url: vine.string(),
          alt: vine.string().trim().minLength(10).maxLength(50),
        })
      )
      .optional(),
  })
)

createArticleValidator.messagesProvider = new SimpleMessagesProvider({
  'title.required': 'Le titre est requis.',
  'title.minLength': 'Le titre doit contenir au moins 5 caractères.',
  'title.maxLength': 'Le titre ne peut pas dépasser 255 caractères.',

  'slug.required': 'Le slug est requis.',
  'slug.regex': 'Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets.',
  'slug.minLength': 'Le slug doit contenir au moins 5 caractères.',
  'slug.maxLength': 'Le slug ne peut pas dépasser 255 caractères.',
  'slug.unique': 'Ce slug est déjà utilisé.',

  'metaDescription.required': 'La méta description est requise.',
  'metaDescription.minLength': 'La méta description doit contenir au moins 5 caractères.',
  'metaDescription.maxLength': 'La méta description ne peut pas dépasser 160 caractères.',

  'content.required': 'Le contenu est requis.',
  'content.minLength': 'Le contenu doit contenir au moins 20 caractères.',

  'images.*.url.required': "L'URL de l'image est requise.",
  'images.*.alt.required': 'Le texte alternatif est requis pour chaque image.',
  'images.*.alt.minLength': 'Le texte alternatif doit contenir au moins 10 caractères.',
  'images.*.alt.maxLength': 'Le texte alternatif ne peut pas dépasser 50 caractères.',
})

export const updateArticleValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(5).maxLength(255).trim().optional(),
    slug: vine
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .minLength(5)
      .maxLength(255)
      .trim()
      .unique(async (db, value) => {
        const slug = await db.from('articles').where('slug', value).first()
        return !slug
      })
      .optional(),
    metaDescription: vine.string().minLength(5).maxLength(160).trim().optional(),
    content: vine.string().minLength(20).optional(),
    images: vine
      .array(
        vine.object({
          url: vine.string(),
          alt: vine.string().trim().minLength(10).maxLength(50),
        })
      )
      .optional(),
  })
)

updateArticleValidator.messagesProvider = new SimpleMessagesProvider({
  'title.minLength': 'Le titre doit contenir au moins 5 caractères.',
  'title.maxLength': 'Le titre ne peut pas dépasser 255 caractères.',

  'slug.regex': 'Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets.',
  'slug.minLength': 'Le slug doit contenir au moins 5 caractères.',
  'slug.maxLength': 'Le slug ne peut pas dépasser 255 caractères.',
  'slug.unique': 'Ce slug est déjà utilisé.',

  'metaDescription.minLength': 'La méta description doit contenir au moins 5 caractères.',
  'metaDescription.maxLength': 'La méta description ne peut pas dépasser 160 caractères.',

  'content.minLength': 'Le contenu doit contenir au moins 20 caractères.',

  'images.*.url.required': "L'URL de l'image est requise.",
  'images.*.alt.minLength': 'Le texte alternatif doit contenir au moins 10 caractères.',
  'images.*.alt.maxLength': 'Le texte alternatif ne peut pas dépasser 50 caractères.',
})
