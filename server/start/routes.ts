/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ArticlesController = () => import('#controllers/articles_controller')

router.get('/articles', [ArticlesController, 'index'])
router.get('/articles/:id', [ArticlesController, 'show'])
router.post('/articles', [ArticlesController, 'create'])
router.put('/articles/:id', [ArticlesController, 'update'])
router.delete('/articles/:id', [ArticlesController, 'destroy'])
