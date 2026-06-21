# 📝 MarkView

Markdown **görüntüleyici + canlı editör**. Aynı kod tabanı hem **web sitesi**
olarak çalışır hem de **masaüstü uygulaması** (Electron) olarak paketlenir.
Masaüstü sürümü kurulduğunda bilgisayardaki `.md` dosyalarına çift tıklayınca
doğrudan bu uygulamada açılır.

## Özellikler

- ✍️ Canlı önizleme (bölünmüş / editör / önizleme görünümleri)
- 📂 Dosya açma: **Aç** butonu, sürükle-bırak, ya da `.md`'ye çift tıklama (masaüstü)
- 💾 Kaydet (masaüstünde diske yazar, web'de indirir)
- 📤 Dışa aktar: **HTML** (tek dosya, stil gömülü) veya **PDF** (yazdır)
- 📋 **Markdown Cheat Sheet** — örneklerle hızlı başvuru (kopyala butonlu)
- 🌍 **Çoklu dil**: Türkçe / English / Español (arayüz, örnekler ve karşılama metni)
- ⬇️ Web sitesinden **masaüstü uygulamasını indirme** linki (masaüstü sürümde gizli)
- 🌙 Koyu / açık tema
- 🎨 Kod blokları için sözdizimi renklendirme, GitHub-flavored markdown, tablolar
- 🔒 İçerik render edilmeden önce temizlenir (XSS koruması)

## Gereksinimler

- [Node.js](https://nodejs.org/) 18+ (sende v24 kurulu)

## Kurulum

```bash
npm install
```

## Web olarak çalıştırma (tarayıcı)

```bash
npm run dev        # geliştirme sunucusu -> http://localhost:5173
npm run build      # üretim derlemesi -> dist/
npm run preview    # dist/ klasörünü yerelde önizle
```

`dist/` klasörü statiktir; herhangi bir web sunucusuna (GitHub Pages, Netlify,
Vercel, kendi sunucun) yüklenerek yayınlanabilir.

### Sitedeki "⬇ İndir" butonu (masaüstü uygulamasını indirme)

Web arayüzündeki **⬇ İndir** butonu `downloads/MarkView-Setup.exe` adresine
bağlanır. Bu dosya `public/downloads/` klasöründen sunulur; `npm run build`
sırasında otomatik olarak `dist/`'e kopyalanır, yani yayınladığın sitede de
indirilebilir olur. (Masaüstü/Electron sürümünde bu buton gizlenir.)

Yeni bir kurulum dosyası üretip indirme linkini güncellemek için:

```bash
npm run dist
copy "release\MarkView Setup 1.0.0.exe" "public\downloads\MarkView-Setup.exe"
```

> Dosya ~77 MB olduğundan git'e eklenmez (`.gitignore`). Gerçek yayında
> binary'yi hosting'e ya da **GitHub Releases**'e koymak daha iyidir; o
> durumda `index.html`'deki `#download` linkinin `href`'ini o adrese çevir.

## Masaüstü olarak çalıştırma (Electron)

```bash
npm run electron:dev     # geliştirme modu (canlı yenilemeli)
npm run dist             # Windows kurulum dosyası (.exe) -> release/
```

`npm run dist` çalıştıktan sonra `release/` klasöründe bir **kurulum sihirbazı
(.exe)** oluşur. Kurulduğunda:

- Başlat menüsüne / masaüstüne **MarkView** kısayolu eklenir
- `.md` ve `.markdown` dosyaları MarkView ile ilişkilendirilir
  (çift tıklayınca uygulamada açılır)

## Proje yapısı

```
markdownviewer/
├── index.html            # uygulama kabuğu
├── vite.config.js        # base:'./' -> dist hem web hem Electron'da çalışır
├── src/
│   ├── main.js           # uygulama mantığı (UI, dosya, kaydet, dışa aktar, dil)
│   ├── markdown.js        # marked + highlight.js + DOMPurify render hattı
│   ├── i18n.js            # Türkçe/İngilizce/İspanyolca çeviriler
│   ├── cheatsheet.js      # Markdown Cheat Sheet içeriği ve oluşturucusu
│   ├── style.css          # tema değişkenleri + markdown/editör/modal stilleri
│   ├── defaultDoc.js      # ilk açılışta gösterilen karşılama metni (dile göre)
│   └── exportHtml.js      # tek dosyalık HTML dışa aktarma şablonu
└── electron/
    ├── main.js           # Electron ana süreç (pencere, menü, dosya ilişkisi)
    └── preload.js        # güvenli IPC köprüsü
```

## Sorun giderme — Windows kurulum derlemesi (`npm run dist`)

electron-builder, `winCodeSign` paketini açarken macOS sembolik bağlantıları
(`.dylib`) oluşturmaya çalışır. Windows'ta bu, **yönetici / Geliştirici Modu**
ayrıcalığı gerektirir; yoksa şu hatayı görürsün:

```
ERROR: Cannot create symbolic link ... libcrypto.dylib
(Gereken ayrıcalık istemci tarafından sağlanmıyor)
```

Çözümlerden **biri** yeterli:

1. **Geliştirici Modu'nu aç:** Ayarlar → Gizlilik ve güvenlik →
   Geliştiriciler için → "Geliştirici Modu" → Açık. Sonra `npm run dist`.
2. **Yönetici olarak çalıştır:** PowerShell'i "Yönetici olarak çalıştır" ile aç,
   proje klasörüne gidip `npm run dist`.
3. **Ayrıcalık gerektirmeyen geçici çözüm** (bu projede uygulandı): macOS'a özel
   `darwin` klasörünü hariç tutarak önbelleği elle aç:

   ```powershell
   $z = ".\node_modules\7zip-bin\win\x64\7za.exe"
   $cache = "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign"
   & $z x (Get-ChildItem "$cache\*.7z")[0].FullName "-o$cache\winCodeSign-2.6.0" -y -xr!darwin
   npm run dist
   ```

Derleme bitince kurulum dosyası `release\MarkView Setup <sürüm>.exe` olur.

## SEO (`markdown-view.com`)

Site arama motorları için optimize edildi:

- **Meta etiketler**: başlık, açıklama, anahtar kelimeler, `canonical`, `robots`
- **Open Graph + Twitter Card**: paylaşımlarda büyük görsel kart
  (`public/og-image.png`, 1200×630)
- **Yapısal veri** (schema.org `WebApplication` JSON-LD) → zengin sonuçlar
- **Çoklu dil `hreflang`** (tr/en/es) + `?lang=` ile dile özel URL'ler; başlık,
  açıklama, `canonical` ve `og:locale` seçilen dile göre değişir
- **`robots.txt`** ve **`sitemap.xml`** (`public/` içinde)
- **Favicon + PWA manifest** (`favicon.svg`, uygulama ikonları, `site.webmanifest`)
- JavaScript kapalıyken bile içerik gösteren `<noscript>` bloğu

### Yayına alırken yapman gerekenler

1. **Domaini bağla**: `dist/`'i `markdown-view.com` köküne yükle (Netlify / Vercel /
   GitHub Pages + özel domain). Tüm SEO adresleri bu domaine göre ayarlı.
2. **Doğrulama kodlarını gir**: `index.html` içinde `REPLACE_WITH_...` yazan iki
   satırı doldur:
   - `google-site-verification` → [Google Search Console](https://search.google.com/search-console)
   - `yandex-verification` → [Yandex Webmaster](https://webmaster.yandex.com/)
3. **Sitemap gönder**: her iki panele `https://markdown-view.com/sitemap.xml` ekle.
4. **HTTPS** kullan (sosyal kartlar ve sıralama için gerekli).

### Görselleri yeniden üretme

Logo veya sosyal kartı değiştirirsen kaynak SVG'leri (`public/favicon.svg`,
`branding/og-image.svg`) düzenleyip PNG'leri yeniden üret:

```bash
npm run make:images
```

> Farklı bir domain kullanacaksan `index.html` (canonical/hreflang/og), `public/robots.txt`
> ve `public/sitemap.xml` içindeki adresleri güncelle.

## Lisans

MIT
