/** @type {import("prettier").Options} */
module.exports = {
  trailingComma: 'es5', // virgule finale là où possible
  semi: false, // pas de point-virgule
  singleQuote: true, // quotes simples
  useTabs: false, // utiliser des espaces, pas des tabs
  tabWidth: 2, // largeur d'indentation de 2 espaces
  quoteProps: 'consistent', // quotes sur les props d'objet si nécessaire
  bracketSpacing: true, // espace entre les accolades { a: 1 }
  arrowParens: 'always', // toujours mettre les parens pour les flèches
  printWidth: 100, // largeur max d’une ligne
}
