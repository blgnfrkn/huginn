# HUGINN: Automated Vulnerability Intelligence System

*Comprehensive Multi-Language Project Documentation, Architecture, and Deployment Guide*

## 🌐 Language Selection / Dil Seçimi / Sprachauswahl

* [🇬🇧 English](#-english-version)

* [🇹🇷 Türkçe](#-türkçe-versiyon)

* [🇩🇪 Deutsch](#-deutsche-version)

## 🇬🇧 English Version

### 👥 Credits

**Core Development Team:** Furkan, Doğukan, Berkay

### 🦅 The Origin of the Name: The Mythological Huginn and Odin's Raven

In Norse mythology, the Allfather god Odin possesses two ravens: **Huginn** (derived from the Old Norse word *hugr*, meaning "Thought") and **Muninn** (meaning "Memory"). According to the *Poetic Edda* and *Prose Edda*, Odin sits upon his high seat Hliðskjálf, surveying all nine realms of the cosmos. However, his vision alone is not enough to stay ahead of cosmic threats and impending doom (Ragnarök). 

To solve this, every single day at dawn, Odin releases Huginn and Muninn to fly across the vast expanse of Midgard and beyond. They act as his ultimate intelligence network. They observe mortal realms, listen to whispers in the shadows, track enemy movements, and watch for looming dangers. By dinner time, they return, alighting upon Odin's shoulders to whisper all the gathered threat intelligence directly into his ears. This gives the Allfather absolute situational awareness and a decisive tactical advantage over his adversaries.

We named our project **Huginn** because its purpose is an exact digital parallel. It serves as our autonomous, untiring security raven, soaring across the vast and chaotic expanse of the global internet, scanning vulnerability feeds, and bringing critical threat intelligence directly to our team before an attack can ever breach our gates.

### 🎯 Project Inception and Purpose

The genesis of the Huginn project was forged in the wake of a recent critical PHP vulnerability incident. That security event made it painfully clear that traditional vulnerability management—relying on manual patch monitoring, delayed vendor advisories, or reactive scanning—is dangerously inadequate for a modern, fast-moving infrastructure. We needed an automated, aggressive, and proactive intelligence pipeline that could monitor our exact technology stack in real-time and alert us the absolute second a high-severity threat emerged.

### 🔒 Zero-Data-Exposure Architecture: GitHub CLI & OpenCVE

A paramount, non-negotiable engineering requirement of Huginn was achieving **absolute zero data exposure**. We had to guarantee that no proprietary company source code, internal architectural blueprints, sensitive database schemas, or business logic was ever shared with external tools or third-party platforms.

To achieve this absolute confidentiality, we designed a metadata-only intelligence extraction pipeline:

1. **GitHub CLI (Metadata & SBOM Extraction):** 
   Instead of uploading or exposing our codebase, we utilize the official **GitHub Command Line Interface (CLI)** to interact with our private repositories locally. We extract a sterile **SBOM (Software Bill of Materials)**. This generated file contains *only* the names and version numbers of public, open-source packages and dependencies we rely on (e.g., `Node.js v22`, `PostgreSQL v16`, `Express.js`, `Nginx`). It contains zero proprietary application logic, zero business secrets, and zero internal code.

2. **OpenCVE (The Global Threat Radar):** 
   We feed this sanitized, public technology list into **OpenCVE**. OpenCVE is an advanced, open-source vulnerability intelligence platform that continuously synchronizes with the National Vulnerability Database (NVD) and global CVE feeds. OpenCVE acts as our stationary radar: it monitors the entire internet strictly for common vulnerabilities and exposures associated *only* with the technologies present on our SBOM list. When a match occurs, OpenCVE instantly triggers an HTTP webhook payload toward our secure server endpoints.

### 🧠 The Extended Analogy: The Fortress and the Raven

To truly understand how Huginn operates, let us visualize our company's infrastructure as a magnificent, heavily fortified medieval fortress sitting upon a strategic hill. 

Surrounding the fortress lies a vast, dark, and perilous forest—this represents the wild and unpredictable internet. Inside this forest, thousands of travelers walk daily: merchants, harmless peasants, petty thieves, and occasionally, formidable armies equipped with siege engines.

**Without Huginn (The Old Way):**
Our castle guards must constantly leave the safety of the fortress walls, wander blindly into the dangerous forest, track down every single merchant, and ask everyone they meet whether an invading army is approaching. It is exhausting, incredibly slow, and leaves our gates unguarded for long stretches of time. By the time a guard stumbles upon a threat, the enemy is already scaling our walls.

**With Huginn (The Automated Way):**
We have unleashed our digital raven high above the forest canopy. Day and night, thousands of minor security bugs, low-level software updates, and harmless community rumors pass through the forest. Huginn is brilliantly trained: he ignores the harmless peasants and petty thieves entirely (representing Low and Medium CVSS-scored vulnerabilities, i.e., scores below 8.0, preventing "alert fatigue"). 

However, the exact second Huginn spots a massive, terrifying siege engine or an elite battalion marching directly toward our specific castle gates—a verified, critical vulnerability with a **CVSS score of 8.0 or higher**—he wastes no time. He tucks his wings and dives straight down at lightning speed. He bypasses the outer courtyard, flies directly through the war room windows, and shatters the silence by screaming the emergency sirens, waking the commanders (our engineering team) instantly, day or night.

### 🛡️ Attack Surface & Monitored Technologies

To ensure our digital watchman knows exactly what to look for, we have defined a strict "Attack Surface" matrix. The following tables outline the critical technologies we actively monitor for vulnerabilities. Any CVE associated with these vendors and products will trigger Huginn's evaluation engine.

#### 1. Core Infrastructure & Databases

*These are the foundational blocks of our systems. Vulnerabilities here often lead to catastrophic system-wide compromises.*

| Technology / Product | Vendor | Criticality & Reason | 
| ----- | ----- | ----- | 
| **Node.js** | Node.js Foundation | **High:** Core runtime for backend operations. RCE vulnerabilities are fatal. | 
| **PostgreSQL** | PostgreSQL | **High:** Primary data store and queue manager. | 
| **Supabase** | Supabase | **Medium-High:** Cloud wrapper and telemetry storage. | 
| **Docker** | Docker Inc. | **High:** Container escape vulnerabilities can compromise the host OS. | 
| **Linux (e.g., Ubuntu)** | Canonical | **High:** The base operating system for servers and development. | 

#### 2. Backend & Network Ecosystem

*Frameworks and tools handling internal logic, external requests, and dependency management.*

| Technology / Product | Vendor | Criticality & Reason | 
| ----- | ----- | ----- | 
| **Express.js** | OpenJS Foundation | **High:** Primary HTTP server handling incoming webhooks. | 
| **Axios** | Axios | **Medium:** Handles outbound requests; susceptible to SSRF. | 
| **Nodemailer** | Nodemailer | **Low-Medium:** SMTP engine. Must be monitored for injection flaws. | 
| **Nginx** | F5 Networks | **High:** Reverse proxy. Buffer overflow or DoS flaws can take systems offline. | 
| **npm** | npm / GitHub | **Medium:** Supply-chain attacks via compromised packages. | 

#### 3. Security & Cryptography

*The shields protecting our data in transit and at rest.*

| Technology / Product | Vendor | Criticality & Reason | 
| ----- | ----- | ----- | 
| **OpenSSL** | OpenSSL | **Critical:** The backbone of HTTPS/TLS encryption. | 
| **dotenv** | Motdotla | **High:** Manages environment variables and secrets in memory. | 
| **Git** | Git | **Medium:** Version control. Remote code execution flaws must be tracked. | 

### ⚙️ Technical Architecture and Data Flow

Huginn is engineered as a lightweight, event-driven, and **stateless** microservice built on Node.js and Express.js, containerized for absolute portability.

```
[ Local Private Repo ] 
         │
         ▼ (GitHub CLI - Extracts Public Package Names Only)
[ Sterile SBOM List ] ──► [ OpenCVE Platform (Global Radar) ]
                                      │
                                      │ (New Vulnerability Detected)
                                      │ (Dispatches JSON via HTTP POST Webhook)
                                      ▼
=================================================================================
                     HUGINN DOCKER CONTAINER (Isolated Port 3000)
=================================================================================
[ Express.js Endpoint: POST /webhook ]
       │
       ├─► Parses Payload: Extract CVE ID, CVSS Score, Vendor, Product, Description
       │
       ├─► Condition: Is CVSS Score >= 8.0?
             │
             ├─► [NO]  ──► Drop Payload / Respond with 200 OK (Noise Filtered Out)
             │
             └─► [YES] ──► 🚨 INITIATE CRITICAL MULTI-CHANNEL DISPATCH 🚨
                             │
                             ├─==> 🐘 SUPABASE (PostgreSQL): SQL INSERT (Persistent Audit Log)
                             │
                             ├─==> 📧 NODEMAILER (Gmail SMTP): Detailed Technical Briefing Email
                             │
                             └─==> 💬 TELEGRAM BOT API: Instant Markdown Push Notification (Mobile)
```

### 🐳 Dockerized Deployment Pipeline

To ensure Huginn operates independently of local machine states, reboots, or sleep cycles, it is fully dockerized. Here is how we build and deploy our containerized sentinel:

1. **Dockerizing the Service (`Dockerfile`):**
   We encapsulate Node.js, dependencies, and application logic into a secure, minimal container image.
2. **Environment Isolation (`.env`):**
   All sensitive tokens (Supabase keys, Gmail SMTP credentials, Telegram Bot tokens) are injected securely at runtime via environment variables, never hardcoded into the image.
3. **Container Execution:**
   Running the container ensures 24/7 autonomous monitoring on a persistent VPS or cloud node.


### 📞 Contact & Subscription

If you are an engineer, DevOps specialist, or operations stakeholder who needs to receive these critical security dispatches, please contact **Furkan** directly at **+90 551 191 16 93**. Upon request, your contact endpoints will be securely registered into both our **Automated Email Mailing List** and our **Telegram Emergency Alert Channel**.

---

## 🇹🇷 Türkçe Versiyon

### 👥 Emeği Geçenler

**Çekirdek Geliştirici Ekip:** Furkan, Doğukan, Berkay

### 🦅 İsmin Kökeni: Mitolojik Huginn ve Odin'in Kuzgunları

İskandinav mitolojisinde, tanrıların babası Odin’in iki kutsal kuzgunu vardır: **Huginn** (Eski Norsça *hugr* kelimesinden türemiş olup "Düşünce" anlamına gelir) ve **Muninn** ("Hafıza"). *Edda* destanlarına göre Odin, tanrılar tahtı Hliðskjálf’te oturarak evrendeki dokuz diyarı gözetler; ancak yalnızca kendi gözleri, evrende dönen entrikaları, sinsi tehditleri ve yaklaşan Ragnarök'ü (kıyameti) zamanında fark etmek için asla yeterli değildir.

Bu mutlak kör noktayı kapatmak için Odin, her şafak vakti bu iki kuzgununu Midgard’ın ve ötesinin uçsuz bucaksız göklerine salar. Huginn ve Muninn, Odin’in en sadık istihbarat ajanlarıdır. Dünyayı karış karış gezerler, gölgelerdeki fısıltıları dinler, düşman hareketlerini ve yaklaşan tehlikeleri izlerler. Akşam vakti saraya geri dönüp Odin’in omuzlarına konarlar ve topladıkları tüm kritik istihbaratı doğrudan onun kulaklarına fısıldarlar. Bu sayede Odin, düşmanlarından hep bir adım önde olur ve mutlak bir durumsal farkındalık kazanır.

Projeye **Huginn** adını vermemizin nedeni, yazılım mimarimizde tam olarak bu mitolojik görevi üstlenmesidir. O bizim dijital kuzgunumuzdur; internetin karanlık ve tehlikeli ağlarında yorulmadan uçar, küresel zafiyet havuzlarını tarar ve sistemlerimize yönelik en ufak bir tehdit siber saldırıya dönüşmeden önce kritik istihbaratı doğrudan ekibimizin cebine indirir.

### 🎯 Projenin Ortaya Çıkışı ve Amacı

Huginn projesinin kıvılcımı, yakın geçmişte yaşadığımız kritik PHP güvenlik açığı krizinden sonra ateşlendi. O olay bize çok acı bir şekilde gösterdi ki; güvenlik bültenlerini manuel olarak takip etmek, üretici yamalarının yayımlanmasını beklemek veya reaktif taramalarla yetinmek modern bir altyapı için intihardır. Şirketimizin özel atak yüzeyini saniyede bir tarayacak, yalan yanlış alarmlarla vakit kaybetmeyecek ve gerçekten kritik bir tehlike kapıya dayanır dayanmaz bizi uyaracak proaktif, acımasız ve tam otomatize edilmiş bir sisteme mutlak surette ihtiyaç duyuyorduk.

### 🔒 Sıfır Veri İfşası (Zero-Data-Exposure) Mimarisi: GitHub CLI ve OpenCVE

Huginn tasarlanırken konulan en katı, taviz verilmez kural **sıfır veri ifşası (zero data exposure)** prensibiydi. Şirketimizin hiçbir özel kaynak kodunun, gizli iş mantığının, veritabanı şemalarının veya mimari planlarının dışarıdaki herhangi bir bulut servisine veya 3. parti araca asla ve asla gönderilmediğinden %100 emin olmalıydık.

Bu mutlak gizliliği korumak için metadata (üstveri) tabanlı şu güvenli akışı kurguladık:

1. **GitHub CLI (SBOM Çıkarımı):** 
   Kod tabanımızı dışarıya açmak veya upload etmek yerine, yerel makinelerimizde resmi **GitHub Komut Satırı Arayüzü'nü (CLI)** kullanarak özel depolarımızla güvenli bir etkileşim kurarız. Bu araç, depolarımızdan yalnızca bir **SBOM (Software Bill of Materials - Yazılım Malzeme Listesi)** çıkarır. Bu liste *sadece* kullandığımız açık kaynaklı paketlerin ve kütüphanelerin isimleri ile versiyon numaralarından ibarettir (Örn: `Node.js v22`, `PostgreSQL v16`, `Express.js`). İçerisinde şirketimize ait tek bir satır iş mantığı veya kod parçacığı barındırmaz.

2. **OpenCVE (Küresel Tehdit Radarı):** 
   Ürettiğimiz bu tamamen steril ve kod içermeyen teknoloji listesini **OpenCVE** sistemine besleriz. OpenCVE, Ulusal Zafiyet Veritabanı (NVD) ile anlık senkronize olan güçlü bir açık kaynaklı zafiyet istihbarat platformudur. OpenCVE bizim sabit radarımızdır: Tüm dünyayı, *sadece ve sadece* bizim SBOM listemizde yer alan teknolojilerle ilgili yayımlanan yeni CVE'ler (Ortak Zafiyetler ve Etkilenmeler) için tarar. Bir eşleşme yakaladığı anda, güvenli sunucumuza otomatik bir HTTP Webhook paketi fırlatır.

### 🧠 Genişletilmiş Analoji: Ortaçağ Kalesi ve Dijital Kuzgun

Sistemin çalışma mantığını zihninizde somutlaştırmak için şirket altyapımızı stratejik bir tepeye kurulmuş, kalın surlarla çevrili görkemli bir ortaçağ kalesi olarak düşünün. 

Kalenin etrafını saran o uçsuz bucaksız, karanlık orman ise vahşi ve kuralsız internet dünyasıdır. Bu ormanda her gün binlerce insan yürür: masum tüccarlar, sıradan gezginler, küçük hırsızlar ve bazen de surlarımızı yıkmaya gelen devasa ordular.

**Huginn Olmadan (Eski Yöntem):**
Kalenin muhafızları, tehlikenin ne zaman geleceğini bilmediği için sürekli surlardan dışarı çıkmak, karanlık ormanda saatlerce yürümek ve karşılaştıkları herkese yaklaşan bir ordu olup olmadığını sormak zorundadır. Bu yöntem tükenmek bilmeyen bir zaman kaybıdır ve muhafızlar dışarıdayken kale savunmasız kalır.

**Huginn İle (Otomatize Mimari):**
Artık ormanın ta tepelerinde, bulutların arasında uçan sihirli bir kuzgunumuz var. Ormandan her gün binlerce küçük yazılım hatası, önemsiz güncellemeler ve gürültü yaratan güvenlik dedikoduları geçer. Huginn inanılmaz derecede akıllıdır; masum köylüleri ve küçük hırsızları (8.0 skorunun altındaki Düşük/Orta seviyeli açıkları) tamamen yok sayar ve alarm yorgunluğunun önüne geçer.

Ancak Huginn, ormanın derinliklerinde tam bizim kaleyi hedef almış, devasa bir kuşatma makinesi veya elit paralı asker birliklerinin ilerlediğini gördüğü o an —yani **CVSS skoru 8.0 ve üzerinde olan doğrulanmış kritik bir açık** tespit edildiğinde— bir saniye bile tereddüt etmez. Kanatlarını kapatır ve yıldırım hızıyla kaleye dalar. Dış surları es geçerek doğrudan savaş odasının camından içeri girer ve acil durum sirenlerini son ses çalarak komutanları (mühendislik ekibini) uykusundan uyandırır.

### 🛡️ Atak Yüzeyi ve İzlenen Teknolojiler

Dijital bekçimizin tam olarak neyi arayacağını bilmesi için katı bir "Atak Yüzeyi" matrisi tanımladık. Aşağıdaki tablolar, zafiyetlere karşı aktif olarak izlediğimiz kritik teknolojileri göstermektedir. Bu üreticiler ve ürünlerle ilgili çıkacak her türlü CVE, doğrudan Huginn'in radarına takılacaktır.

#### 1. Çekirdek Altyapı ve Veritabanları

*Sistemlerimizin temel taşlarıdır. Buradaki açıklar genellikle tüm sistemin ele geçirilmesiyle sonuçlanır.*

| Teknoloji / Ürün | Üretici (Vendor) | Kritiklik ve Sebep | 
| ----- | ----- | ----- | 
| **Node.js** | Node.js Foundation | **Yüksek:** Backend operasyonlarının kalbidir. RCE açıkları ölümcüldür. | 
| **PostgreSQL** | PostgreSQL | **Yüksek:** Ana veri deposu ve kuyruk yöneticisi. | 
| **Supabase** | Supabase | **Orta-Yüksek:** Bulut veritabanı sarmalayıcısı ve telemetri deposu. | 
| **Docker** | Docker Inc. | **Yüksek:** Container kaçış (Escape) zafiyetleri ana sunucuyu tehlikeye atar. | 
| **Linux (Örn: Ubuntu)** | Canonical | **Yüksek:** Sunucular ve geliştirme için temel işletim sistemi. | 

#### 2. Backend ve Ağ Ekosistemi

*İç mantığı, dış istekleri ve paket bağımlılıklarını yöneten araçlar.*

| Teknoloji / Ürün | Üretici (Vendor) | Kritiklik ve Sebep | 
| ----- | ----- | ----- | 
| **Express.js** | OpenJS Foundation | **Yüksek:** Gelen webhook'ları karşılayan ana HTTP sunucusu. | 
| **Axios** | Axios | **Orta:** Dış istekleri yönetir; SSRF açıklarına karşı hassastır. | 
| **Nodemailer** | Nodemailer | **Düşük-Orta:** SMTP motoru. Enjeksiyon açıklarına karşı izlenmelidir. | 
| **Nginx** | F5 Networks | **Yüksek:** Reverse proxy. DoS açıkları sistemleri çevrimdışı bırakabilir. | 
| **npm** | npm / GitHub | **Orta:** Zararlı paketler üzerinden tedarik zinciri (supply-chain) saldırıları. | 

#### 3. Güvenlik ve Kriptografi

*Verilerimizi koruyan dijital kalkanlarımız.*

| Teknoloji / Ürün | Üretici (Vendor) | Kritiklik ve Sebep | 
| ----- | ----- | ----- | 
| **OpenSSL** | OpenSSL | **Kritik:** HTTPS/TLS şifrelemesinin omurgası. | 
| **dotenv** | Motdotla | **Yüksek:** Şifreleri ve gizli anahtarları bellekte yönetir. | 
| **Git** | Git | **Orta:** Versiyon kontrolü. Uzaktan kod çalıştırma (RCE) açıkları takip edilmeli. | 


### ⚙️ Teknik Mimari ve Veri Akışı

Huginn; Node.js ve Express.js altyapısıyla yazılmış, durumsuz (stateless), olay yönelimli (event-driven) ve tamamen izole çalışabilen hafif bir mikro hizmettir.

```
[ Yerel Gizli Repo ] 
         │
         ▼ (GitHub CLI - Yalnızca Paket Adlarını Çeker)
[ Steril SBOM Listesi ] ──► [ OpenCVE Platformu (Küresel Radar) ]
                                      │
                                      │ (Yeni Zafiyet Tespit Edildi)
                                      │ (HTTP POST Webhook ile JSON İletir)
                                      ▼
=================================================================================
                   HUGINN DOCKER KONTEYNERİ (İzole Port 3000)
=================================================================================
[ Express.js Uç Noktası: POST /webhook ]
       │
       ├─► Paketi Çözümle: CVE ID, CVSS Skoru, Üretici, Ürün ve Açıklama Alınır
       │
       ├─► Mantıksal Sınama: CVSS Skoru >= 8.0 mı?
             │
             ├─► [HAYIR] ──► Paketi Sessizce Ele / 200 OK Dön (Gürültü filtrelendi)
             │
             └─► [EVET]  ──► 🚨 KRİTİK ÇOKLU KANAL DAĞITIMINI BAŞLAT 🚨
                             │
                             ├─==> 🐘 SUPABASE (PostgreSQL): SQL INSERT (Kalıcı Denetim Günlüğü)
                             │
                             ├─==> 📧 NODEMAILER (Gmail SMTP): Detaylı Teknik Bilgilendirme Maili
                             │
                             └─==> 💬 TELEGRAM BOT API: Anında Markdown Mobil Bildirimi
```

### 🐳 Dockerize Edilmiş Dağıtım Süreci

Huginn'in yerel bilgisayarın açık kalmasına bağımlı olmaması, sunucu çökmelerinden etkilenmemesi ve 7/24 kesintisiz nöbet tutabilmesi için tamamen **Docker** altyapısıyla paketlenmiştir:

1. **Konteynerleştirme (`Dockerfile`):** 
   Uygulamanın çalışması için gereken tüm Node.js bağımlılıkları ve kodlar minimal bir Linux imajı içine hapsedilir.
2. **Çevresel Değişken İzolasyonu (`.env`):** 
   Supabase şifreleri, Gmail uygulama anahtarları ve Telegram Bot token'ları koda asla gömülmez; konteyner ayağa kalkarken güvenli bir şekilde dışarıdan (`environment variables`) beslenir.
3. **7/24 Kesintisiz Operasyon:** 
   Docker daemon sayesinde bulut sunucusunda (VPS) arka planda ölümsüz bir servis olarak çalıştırılır.


### 📞 İletişim ve Entegrasyon

Eğer yazılım, altyapı veya operasyon ekibinin bir üyesiyseniz ve bu kritik güvenlik alarmlarını doğrudan cihazınızda almak istiyorsanız, lütfen **+90 551 191 16 93** numaralı hat üzerinden **Furkan** ile iletişime geçin. Bilgileriniz güvenli bir şekilde **Otomatik E-Posta Listemize** ve **Telegram Acil Durum Kanalımıza** tanımlanacaktır.

---

## 🇩🇪 Deutsche Version

### 👥 Mitwirkende

**Kernentwicklungsteam:** Furkan, Doğukan, Berkay

### 🦅 Der Ursprung des Namens: Der mythologische Huginn und Odins Raben

In der nordischen Mythologie besitzt der Göttervater Odin zwei heilige Raben: **Huginn** (abgeleitet vom altnordischen Wort *hugr*, was „Gedanke“ bedeutet) und **Muninn** („Erinnerung“). Den *Edda*-Überlieferungen zufolge sitzt Odin auf seinem Hochsitz Hliðskjálf und überblickt alle neun Welten des Kosmos; doch seine eigenen Augen allein reichen niemals aus, um versteckte Intrigen, lauernde Bedrohungen und den drohenden Untergang (Ragnarök) rechtzeitig zu erkennen.

Um diesen blinden Fleck zu beseitigen, entsendet Odin jeden Tag im Morgengrauen seine beiden Raben, um über die weiten Himmel von Midgard und darüber hinaus zu fliegen. Huginn und Muninn fungieren als sein ultimatives Spionagenetzwerk. Sie bereisen die Reiche der Sterblichen, lauschen den Gerüschen im Schatten, verfolgen feindliche Truppenbewegungen und halten Ausschau nach Gefahren. Zur Essenszeit kehren sie zurück, setzen sich auf Odins Schultern und flüstern ihm alle gesammelten Bedrohungsinformationen direkt ins Ohr. Dies verschafft Odin absolute situative Wachsamkeit und einen entscheidenden taktischen Vorteil.

Wir haben unser Projekt **Huginn** genannt, weil sein Zweck eine exakte digitale Entsprechung ist. Er ist unser autonomer, unermüdlicher Sicherheitsrabe, der durch das riesige und chaotische Internet fliegt, globale Schwachstellen-Feeds scannt und kritische Sicherheitsinformationen direkt an unser Team übermittelt, bevor ein Angriff überhaupt unsere Mauern erreichen kann.

### 🎯 Projektinitiierung und Zweck

Die Entstehung des Huginn-Projekts wurde durch einen jüngsten kritischen PHP-Sicherheitsvorfall ausgelöst. Dieses Ereignis machte schmerzlich deutlich, dass herkömmliches Schwachstellenmanagement — das auf manueller Patch-Überwachung oder verzögerten Herstellerwarnungen beruht — für eine moderne Infrastruktur lebensgefährlich ist. Wir benötigten eine automatisierte, proaktive und kompromisslose Intelligence-Pipeline, die unsere exakte Technologiestapel in Echtzeit überwacht und uns alarmiert, sobald eine hochriskante Bedrohung auftaucht.

### 🔒 Zero-Data-Exposure-Architektur: GitHub CLI & OpenCVE

Eine oberste, unverhandelbare technische Anforderung an Huginn war die Erzielung einer **absoluten Zero-Data-Exposure** (Null-Daten-Offenlegung). Wir mussten garantieren, dass niemals firmeneigener Quellcode, interne Architekturpläne, sensible Datenbankschemata oder Geschäftslogik an externe Tools oder Drittanbieterplattformen weitergegeben werden.

Um diese absolute Vertraulichkeit zu gewährleisten, haben wir eine reine Metadaten-Intelligence-Pipeline entwickelt:

1. **GitHub CLI (Metadaten- & SBOM-Extraktion):** 
   Anstatt unseren Quellcode hochzuladen oder offenzulegen, nutzen wir die offizielle **GitHub Command Line Interface (CLI)** lokal auf unseren Maschinen. Wir extrahieren eine sterile **SBOM (Software Bill of Materials)**. Diese generierte Datei enthält *nur* die Namen und Versionsnummern der öffentlichen Open-Source-Pakete und Abhängigkeiten, die wir verwenden (z. B. `Node.js v22`, `PostgreSQL v16`, `Express.js`). Sie enthält null proprietäre Anwendungslogik oder Geschäftsgeheimnisse.

2. **OpenCVE (Das globale Bedrohungsradar):** 
   Wir speisen diese sterile, codefreie Technologieliste in **OpenCVE** ein. OpenCVE ist eine fortschrittliche Open-Source-Plattform für Schwachstellen-Intelligence, die kontinuierlich mit der National Vulnerability Database (NVD) synchronisiert wird. OpenCVE fungiert als unser stationäres Radar: Es überwacht das Internet ausschließlich auf gemeinsame Schwachstellen und Exponierungen (CVEs), die sich auf die Technologien in unserer SBOM-Liste beziehen. Bei einer Übereinstimmung sendet OpenCVE sofort einen HTTP-Webhook-Payload an unsere sicheren Serverendpunkte.

### 🧠 Die erweiterte Analogie: Die Festung und der Rabe

Um zu verstehen, wie Huginn funktioniert, stellen wir uns unsere Unternehmensinfokommunikation als eine prächtige, schwer befestigte mittelalterliche Burg vor, die auf einem strategischen Hügel thronen.

Um die Burg herum liegt ein riesiger, dunkler und gefährlicher Wald — dieser repräsentiert das wilde und unvorhersehbare Internet. In diesem Wald wandern täglich Tausende von Menschen: Händler, harmlose Bauern, Kleinkriminelle und gelegentlich mächtige Armeen mit Belagerungsmaschinen.

**Ohne Huginn (Der alte Weg):**
Unsere Burgwachen müssen ständig die Sicherheit der Festung verlassen, blind in den gefährlichen Wald wandern und jeden fragen, ob eine feindliche Armee im Anmarsch ist. Das ist extrem anstrengend und lässt unsere Tore unbewacht.

**Mit Huginn (Der automatisierte Weg):**
Wir haben unseren digitalen Raben hoch über den Baumkronen des Waldes freigesetzt. Tag und Nacht ziehen Tausende kleiner Software-Bugs, unbedeutende Updates und harmlose Gerüchte durch den Wald. Huginn ist exzellent trainiert: Er ignoriert harmlose Bauern und Kleinkriminelle vollständig (CVSS-Scores unter 8.0 werden herausgefiltert, um Alarmmüdigkeit zu vermeiden).

Sobald Huginn jedoch eine gewaltige Belagerungsmaschine oder eine Eliteeinheit entdeckt, die direkt auf unsere Burgtore marschiert — eine verifizierte, kritische Schwachstelle mit einem **CVSS-Score von 8.0 oder höher** —, zögert er keine Sekunde. Er legt die Flügel an und stürzt mit Blitzgeschwindigkeit herab. Er umgeht den äußeren Hof, fliegt direkt durch die Fenster des Kriegssaals und durchbricht die Stille mit Notfallsirenen, wodurch er das Engineering-Team sofort weckt.

### 🛡️ Angriffsfläche & Überwachte Technologien

Damit unser digitaler Wächter genau weiß, wonach er suchen muss, haben wir eine strikte Matrix der "Angriffsfläche" definiert. Die folgenden Tabellen zeigen die kritischen Technologien, die wir aktiv auf Schwachstellen überwachen. Jedes CVE, das mit diesen Herstellern und Produkten in Verbindung steht, löst den Bewertungsmechanismus von Huginn aus.

#### 1. Kerninfrastruktur & Datenbanken

*Dies sind die Grundpfeiler unserer Systeme. Schwachstellen hier führen oft zu katastrophalen systemweiten Kompromittierungen.*

| Technologie / Produkt | Hersteller (Vendor) | Kritikalität & Grund | 
| ----- | ----- | ----- | 
| **Node.js** | Node.js Foundation | **Hoch:** Kernlaufzeit für Backend-Operationen. RCE-Schwachstellen sind fatal. | 
| **PostgreSQL** | PostgreSQL | **Hoch:** Primärer Datenspeicher und Queue-Manager. | 
| **Supabase** | Supabase | **Mittel-Hoch:** Cloud-Datenbank-Wrapper und Telemetriespeicher. | 
| **Docker** | Docker Inc. | **Hoch:** Container-Escape-Schwachstellen können das Host-Betriebssystem gefährden. | 
| **Linux (z.B. Ubuntu)** | Canonical | **Hoch:** Das Basis-Betriebssystem für Server und Entwicklung. | 

#### 2. Backend & Netzwerk-Ökosystem

*Frameworks und Tools zur Verwaltung interner Logik, externer Anfragen und Abhängigkeiten.*

| Technologie / Produkt | Hersteller (Vendor) | Kritikalität & Grund | 
| ----- | ----- | ----- | 
| **Express.js** | OpenJS Foundation | **Hoch:** Primärer HTTP-Server zur Verarbeitung eingehender Webhooks. | 
| **Axios** | Axios | **Mittel:** Verwaltet ausgehende Anfragen; anfällig für SSRF. | 
| **Nodemailer** | Nodemailer | **Niedrig-Mittel:** SMTP-Engine. Muss auf Injection-Fehler überwacht werden. | 
| **Nginx** | F5 Networks | **Hoch:** Reverse-Proxy. Buffer-Overflow oder DoS-Fehler können Systeme offline nehmen. | 
| **npm** | npm / GitHub | **Mittel:** Supply-Chain-Angriffe über kompromittierte Pakete. | 

#### 3. Sicherheit & Kryptographie

*Die Schutzschilde, die unsere Daten sichern.*

| Technologie / Produkt | Hersteller (Vendor) | Kritikalität & Grund | 
| ----- | ----- | ----- | 
| **OpenSSL** | OpenSSL | **Kritisch:** Das Rückgrat der HTTPS/TLS-Verschlüsselung. | 
| **dotenv** | Motdotla | **Hoch:** Verwaltet Umgebungsvariablen und Geheimnisse im Speicher. | 
| **Git** | Git | **Mittel:** Versionskontrolle. Remote-Code-Ausführungsfehler müssen verfolgt werden. | 

### ⚙️ Technische Architektur und Datenfluss

Huginn ist als leichtgewichtiger, ereignisgesteuerter und **zustandsloser (stateless)** Mikroservice auf Basis von Node.js und Express.js konzipiert und vollständig containerisiert.

```
[ Lokales Privates Repo ] 
         │
         ▼ (GitHub CLI - Extrahiert nur öffentliche Paketnamen)
[ Sterile SBOM-Liste ] ──► [ OpenCVE Plattform (Globales Radar) ]
                                      │
                                      │ (Neue Schwachstelle entdeckt)
                                      │ (Sendet JSON via HTTP POST Webhook)
                                      ▼
=================================================================================
                 HUGINN DOCKER CONTAINER (Isoliert auf Port 3000)
=================================================================================
[ Express.js Endpunkt: POST /webhook ]
       │
       ├─► Payload-Parsing: Extrahiert CVE-ID, CVSS-Score, Hersteller, Produkt, Beschreibung
       │
       ├─► Bedingung: Ist der CVSS-Score >= 8.0?
             │
             ├─► [NEIN] ──► Payload verwerfen / 200 OK senden (Rauschen herausgefiltert)
             │
             └─► [JA]   ──► 🚨 KRITISCHES MULTI-KANAL-DISPATCH INITIIEREN 🚨
                             │
                             ├─==> 🐘 SUPABASE (PostgreSQL): SQL INSERT (Dauerhaftes Audit-Log)
                             │
                             ├─==> 📧 NODEMAILER (Gmail SMTP): Detaillierte technische E-Mail
                             │
                             └─==> 💬 TELEGRAM BOT API: Sofortige Markdown-Push-Benachrichtigung
```

### 🐳 Dockerisierter Bereitstellungspipeline

Damit Huginn unabhängig von lokalen Computerzuständen, Neustarts oder Ruhephasen arbeitet, ist es vollständig in Docker gekapselt:

1. **Containerisierung (`Dockerfile`):** 
   Alle Node.js-Abhängigkeiten und die Anwendungslogik werden in einem minimalen Linux-Container-Image eingeschlossen.
2. **Umgebungsisolierung (`.env`):** 
   Sämtliche sensiblen Token (Supabase-Schlüssel, Gmail-SMTP-Anmeldeinformationen, Telegram-Bot-Token) werden zur Laufzeit sicher über Umgebungsvariablen injiziert, ohne jemals im Image hartcodiert zu sein.
3. **Container-Ausführung:** 
   Läuft als unsterblicher Hintergrunddienst auf einem persistierten VPS oder Cloud-Node.


### 📞 Kontakt & Abonnement

Wenn Sie Teil des Engineering-, DevOps- oder Operations-Teams sind und diese kritischen Sicherheitsalarme erhalten müssen, wenden Sie sich bitte direkt an **Furkan** unter der Nummer **+90 551 191 16 93**. Nach Prüfung werden Ihre Endpunkte sicher in unsere **Automatisierte E-Mail-Verteilerliste** und den **Telegram-Notfallalarm-Kanal** eingetragen.