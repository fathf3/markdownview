// First-run welcome document, per language.

const DOCS = {
  tr: `# 📝 MarkView'a Hoş Geldin

Bu, **canlı önizlemeli** bir Markdown editörü ve görüntüleyicidir.
Soldaki alana yaz, sağda anında render edilsin.

## Neler yapabilirsin?

- **Aç** ile bilgisayarından bir \`.md\` dosyası seç
- Dosyayı doğrudan pencereye **sürükle-bırak**
- **Kaydet** ile düzenlediğin metni diske yaz
- **Dışa Aktar** ile \`HTML\` veya \`PDF\` olarak çıktı al
- Üstteki **Cheat Sheet** butonuyla Markdown örneklerini gör
- Dil menüsünden **Türkçe / English / Español** seç

> 💡 Masaüstü sürümünü kurduğunda, bilgisayarındaki \`.md\`
> dosyalarına çift tıklayınca doğrudan bu uygulamada açılır.

\`\`\`js
console.log("Markdown yazmaya başla!");
\`\`\`

---

Hazırsan bu metni silip kendi belgeni yazmaya başlayabilirsin. 🚀
`,

  en: `# 📝 Welcome to MarkView

This is a Markdown editor and viewer with **live preview**.
Type on the left and it renders instantly on the right.

## What can you do?

- Use **Open** to pick a \`.md\` file from your computer
- **Drag & drop** a file straight onto the window
- **Save** your edited text to disk
- **Export** as \`HTML\` or \`PDF\`
- Click **Cheat Sheet** above to see Markdown examples
- Pick **Türkçe / English / Español** from the language menu

> 💡 When you install the desktop version, double-clicking a \`.md\`
> file on your computer opens it directly in this app.

\`\`\`js
console.log("Start writing Markdown!");
\`\`\`

---

When you're ready, clear this text and start your own document. 🚀
`,

  es: `# 📝 Bienvenido a MarkView

Es un editor y visor de Markdown con **vista previa en vivo**.
Escribe a la izquierda y se renderiza al instante a la derecha.

## ¿Qué puedes hacer?

- Usa **Abrir** para elegir un archivo \`.md\` de tu equipo
- **Arrastra y suelta** un archivo sobre la ventana
- **Guarda** tu texto editado en el disco
- **Exporta** como \`HTML\` o \`PDF\`
- Pulsa **Guía rápida** arriba para ver ejemplos de Markdown
- Elige **Türkçe / English / Español** en el menú de idioma

> 💡 Al instalar la versión de escritorio, hacer doble clic en un
> archivo \`.md\` lo abre directamente en esta app.

\`\`\`js
console.log("¡Empieza a escribir Markdown!");
\`\`\`

---

Cuando estés listo, borra este texto y empieza tu propio documento. 🚀
`,
};

export function getDefaultDoc(lang) {
  return DOCS[lang] || DOCS.en;
}
