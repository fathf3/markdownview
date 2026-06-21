// First-run welcome document, per language.

// Desktop installer (served from GitHub Releases — always the latest build).
const DL = 'https://github.com/fathf3/markdownview/releases/latest/download/MarkView-Setup.exe';

const DOCS = {
  tr: `# 📝 MarkView'a Hoş Geldin

Canlı önizlemeli, **ücretsiz** bir Markdown editörü ve görüntüleyici.
Soldaki alana yaz, sağda anında render edilsin.

## ⬇️ Online kullan ya da indir

Şu an **online** sürümü kullanıyorsun — kurulum gerekmez. İstersen
**ücretsiz masaüstü uygulamasını indirip** internet olmadan da
kullanabilirsin. Kurduktan sonra bilgisayarındaki \`.md\` dosyalarına
**çift tıklayınca doğrudan MarkView'de açılır**.

👉 **[Windows için indir](${DL})** — ücretsiz, kayıt gerekmez. (Üstteki **İndir** butonu da aynı dosyayı indirir.)

## Neler yapabilirsin?

- **Aç** ile bilgisayarından bir \`.md\` dosyası seç
- Dosyayı doğrudan pencereye **sürükle-bırak**
- **Kaydet** ile düzenlediğin metni diske yaz
- **Dışa Aktar** ile \`HTML\` veya \`PDF\` olarak çıktı al
- Üstteki **Cheat Sheet** ile Markdown örneklerini gör
- Dil menüsünden **Türkçe / English / Español** seç

\`\`\`js
console.log("Markdown yazmaya başla!");
\`\`\`

---

Hazırsan bu metni silip kendi belgeni yazmaya başlayabilirsin. 🚀
`,

  en: `# 📝 Welcome to MarkView

A free Markdown **editor & viewer** with live preview.
Type on the left and it renders instantly on the right.

## ⬇️ Use it online or download it

You're using the **online** version right now — no install needed. You can
also **download the free desktop app** and use MarkView offline. After
installing, **double-clicking any \`.md\` file opens it directly in MarkView**.

👉 **[Download for Windows](${DL})** — free, no signup. (The **Download** button above grabs the same file.)

## What can you do?

- Use **Open** to pick a \`.md\` file from your computer
- **Drag & drop** a file straight onto the window
- **Save** your edited text to disk
- **Export** as \`HTML\` or \`PDF\`
- Click **Cheat Sheet** above to see Markdown examples
- Pick **Türkçe / English / Español** from the language menu

\`\`\`js
console.log("Start writing Markdown!");
\`\`\`

---

When you're ready, clear this text and start your own document. 🚀
`,

  es: `# 📝 Bienvenido a MarkView

Un **editor y visor** de Markdown gratis con vista previa en vivo.
Escribe a la izquierda y se renderiza al instante a la derecha.

## ⬇️ Úsalo online o descárgalo

Ahora estás usando la versión **online** — sin instalación. También puedes
**descargar la app de escritorio gratis** y usar MarkView sin conexión. Tras
instalarla, **al hacer doble clic en un archivo \`.md\` se abre en MarkView**.

👉 **[Descargar para Windows](${DL})** — gratis, sin registro. (El botón **Descargar** de arriba baja el mismo archivo.)

## ¿Qué puedes hacer?

- Usa **Abrir** para elegir un archivo \`.md\` de tu equipo
- **Arrastra y suelta** un archivo sobre la ventana
- **Guarda** tu texto editado en el disco
- **Exporta** como \`HTML\` o \`PDF\`
- Pulsa **Guía rápida** arriba para ver ejemplos de Markdown
- Elige **Türkçe / English / Español** en el menú de idioma

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
