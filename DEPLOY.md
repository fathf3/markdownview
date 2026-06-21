# 🚀 Yayına Alma — GitHub + Vercel + GoDaddy

Kod GitHub'a gider, Vercel repoyu izleyip her `git push`'ta otomatik yayınlar.
Kurulum dosyası (77 MB) repoya değil **GitHub Releases**'e konur.

Repo: <https://github.com/fathf3/markdownview>

## 1) GitHub'a gönder

> Git deposu ve ilk commit hazırlandı, `origin` bağlandı. Sadece şunu çalıştır:

```bash
git push -u origin main
```

GitHub şifre yerine **Personal Access Token** veya tarayıcı girişi ister.

> ⚠️ GitHub'ın gösterdiği `echo / git init / git add / git commit / git remote`
> komutlarını **tekrar çalıştırma** — hepsi yapıldı. Yalnızca `git push` yeterli.

## 2) Vercel'e bağla (otomatik deploy)

1. <https://vercel.com> → **Add New → Project**
2. **Import Git Repository** → `fathf3/markdownview` seç
3. Vercel framework'ü **Vite** algılar (build: `npm run build`, çıktı: `dist`)
4. **Deploy** → birkaç dakikada `…vercel.app` adresinde yayında

Bundan sonra her `git push` siteyi otomatik yeniden yayınlar.

## 3) Kurulum dosyasını GitHub Releases'e yükle

İndirme butonu şu sabit adrese bağlı (her zaman en son sürümü indirir):

```
https://github.com/fathf3/markdownview/releases/latest/download/MarkView-Setup.exe
```

Çalışması için:

1. GitHub repo → sağdaki **Releases** → **Draft a new release**
2. **Tag**: `v1.0.0` · **Title**: `MarkView 1.0.0`
3. Dosya alanına `public/downloads/MarkView-Setup.exe` dosyasını sürükle-bırak
   (asset adı tam olarak `MarkView-Setup.exe` olmalı — dosya zaten bu isimde)
4. **Publish release**

Artık sitedeki **İndir** butonu çalışır. Yeni sürümde aynı dosya adıyla yeni bir
release yayınla; link otomatik en sonuncusunu indirir.

## 4) Özel domain (`markdown-view.com`)

### Vercel
Proje → **Settings → Domains** → ekle: `markdown-view.com` + `www.markdown-view.com`.
Vercel sana kesin DNS değerlerini gösterir.

### GoDaddy → Manage DNS
| Tip   | Host  | Değer                  |
| ----- | ----- | ---------------------- |
| A     | `@`   | `76.76.21.21`          |
| CNAME | `www` | `cname.vercel-dns.com` |

GoDaddy'nin **park / forwarding** ve çakışan `@` A kayıtlarını **sil**. DNS
yayılınca (birkaç dk–saat) HTTPS otomatik kurulur.

## 5) Yandex & Google (domain bağlandıktan sonra)

- `https://markdown-view.com` açılınca `yandex-verification` etiketi canlı olur
  → **Yandex Webmaster → Doğrula**.
- **Google Search Console → Sitemaps** → `https://markdown-view.com/sitemap.xml` ekle.
- Aynı sitemap'i Yandex Webmaster'a da ekle.

---

## Güncelleme akışı (özet)

```bash
# kod değişikliği yaptıktan sonra
git add -A
git commit -m "değişiklik açıklaması"
git push            # Vercel otomatik yeniden yayınlar
```
