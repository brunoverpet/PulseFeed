# PulseFeed 🚀

> 📰 Plateforme générique de blog/actualités pour tester un écosystème **Next.js + TipTap + AdonisJS** en mono-repo avec pnpm.

---

## 🗂 Structure du projet

```text
PulseFeed/
├── client/       # Front-end Next.js + TipTap
├── server/       # Back-end AdonisJS + Tuyau
├── shared/       # Types et helpers partagés (optionnel)
├── package.json
└── pnpm-workspace.yaml
```

---

## ⚡ Tech Stack

- **Front-end** : Next.js, TypeScript, TipTap 
- **Back-end** : AdonisJS, TypeScript, Tuyau (API type-safe)  
- **Mono-repo** : pnpm workspace  

---

## 📝 Objectif du projet

- **PulseFeed** : gestion d’articles avec champs `title`, `slug`, `meta_description`, `content`, `published_at`, `images`.  
- Utiliser **Tuyau** pour des types **type-safe** entre front et back.  
- Créer un workflow mono-repo solide, **déployable via Coolify**.  

---

## 🎯 Futur

- Ajouter un éditeur TipTap avec interface WYSIWYG pour le contenu  
- Intégrer un flux RSS automatique pour le SEO et les réseaux sociaux  
- Ajouter des animations via Framer Motion côté client  
- Préparer un système de publication / draft / preview pour les articles  

---

Made with ❤️ by Bruno

