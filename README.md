# Proizvodnja Premium

Napredni sistem za upravljanje proizvodnjom u pilani i drvoprerađivačkoj industriji.

## 🚀 Funkcionalnosti

### 📋 Glavni Moduli
- **Ponude** - Kreiranje i upravljanje ponudama
- **Radni Nalozi** - Praćenje radnih naloga i proizvodnje
- **Pilana** - Upravljanje procesima pilane
- **Dorada** - Procesi dorade proizvoda
- **Prijem Trupaca** - Unos i praćenje trupaca
- **Blagajna** - Finansijsko upravljanje
- **Admin Panel** - Upravljanje korisnicima i sistemom

### 🔐 Autentifikacija
- Supabase integracija
- Role-based pristup (admin/user)
- Permission sistem

### 📊 Izvještaji
- PDF export
- Excel export
- CSV export
- Print funkcionalnosti

## 🛠️ Tehnologije

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Radix UI, Tailwind CSS
- **Backend**: Supabase
- **Testiranje**: Playwright
- **Dodatne biblioteke**: React Hook Form, Recharts, PDF-lib, XLSX

## 📦 Instalacija

1. **Klonirajte repozitorij**
```bash
git clone <repository-url>
cd proizvodnja-premium
```

2. **Instalirajte zavisnosti**
```bash
npm install
```

3. **Konfigurišite environment varijable**
Kreirajte `.env.local` fajl:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Pokrenite development server**
```bash
npm run dev
```

## 🧪 Testiranje

```bash
# Pokretanje testova
npm run test

# Pokretanje testova u watch modu
npm run test:watch
```

## 📝 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🏗️ Struktura Projekta

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard stranice
│   ├── api/              # API rute
│   └── layout.tsx        # Glavni layout
├── components/            # React komponente
│   ├── ui/               # Osnovne UI komponente
│   ├── dashboard/        # Dashboard komponente
│   ├── pilana/          # Pilana funkcionalnosti
│   ├── radni-nalozi/    # Radni nalozi
│   └── auth/            # Autentifikacija
├── lib/                  # Utility funkcije
├── tests/               # Playwright testovi
└── public/              # Statički fajlovi
```

## 🔧 Konfiguracija

### Supabase Setup

1. **Kreirajte Supabase projekat**
   - Idite na [https://supabase.com](https://supabase.com)
   - Kliknite "New Project"
   - Unesite ime projekta (npr. "proizvodnja-premium")
   - Odaberite organizaciju
   - Kliknite "Create new project"

2. **Konfigurišite autentifikaciju**
   - U Supabase dashboard-u, idite na "Authentication" > "Settings"
   - Omogućite "Email auth"
   - Opciono: dodajte dodatne auth providers (Google, GitHub, itd.)

3. **Kreirajte potrebne tabele**
   U SQL Editor-u kreirajte sljedeće tabele:

```sql
-- Tabela korisnika
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela ponuda
CREATE TABLE ponude (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broj_ponude TEXT UNIQUE NOT NULL,
  datum DATE NOT NULL,
  kupac TEXT NOT NULL,
  ukupan_iznos DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'na-čekanju',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela radnih naloga
CREATE TABLE radni_nalozi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broj_naloga TEXT UNIQUE NOT NULL,
  datum DATE NOT NULL,
  opis TEXT,
  status TEXT DEFAULT 'kreiran',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela pilane
CREATE TABLE pilana (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  datum DATE NOT NULL,
  masina TEXT NOT NULL,
  radnik TEXT,
  status TEXT DEFAULT 'aktivno',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela dorade
CREATE TABLE dorada (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  datum DATE NOT NULL,
  masina TEXT NOT NULL,
  radnik TEXT,
  novi_paket TEXT,
  status TEXT DEFAULT 'u-toku',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela trupaca
CREATE TABLE trupci (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_kod TEXT UNIQUE NOT NULL,
  broj_plocice TEXT,
  boja_plocice TEXT,
  klasa_trupca TEXT,
  duzina_trupca INTEGER,
  precnik_trupca INTEGER,
  m3 DECIMAL(10,3),
  datum_prijema DATE NOT NULL,
  sumarija TEXT,
  status TEXT DEFAULT 'na-stanju',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela otpremnica
CREATE TABLE otpremnice (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broj_otpremnice TEXT UNIQUE NOT NULL,
  datum DATE NOT NULL,
  kupac TEXT NOT NULL,
  ukupan_iznos DECIMAL(10,2) NOT NULL,
  depozit DECIMAL(10,2) DEFAULT 0,
  za_uplatu DECIMAL(10,2) NOT NULL,
  preuzeo TEXT,
  prevoznik TEXT,
  status_naplate TEXT DEFAULT 'isporučeno-nenaplaćeno',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. **Kreirajte admin korisnika**
```sql
INSERT INTO users (email, username, role, permissions) 
VALUES ('admin@test.com', 'admin', 'admin', ARRAY['all']);
```

5. **Kopirajte environment varijable**
   - U Supabase dashboard-u, idite na "Settings" > "API"
   - Kopirajte "Project URL" i "anon public" key
   - Kreirajte `.env.local` fajl u root direktoriju projekta:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Environment Variables
```env
# Supabase (obavezno)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Integration (opciono)
DEEPSEEK_API_KEY=your-deepseek-api-key
```

## 🚀 Deployment

### Vercel (Preporučeno)
1. Povežite GitHub repozitorij sa Vercel
2. Konfigurišite environment varijable u Vercel dashboard-u
3. Deploy

### Docker
```bash
# Build image
docker build -t proizvodnja-premium .

# Run container
docker run -p 3000:3000 proizvodnja-premium
```

### Netlify
1. Povežite GitHub repozitorij sa Netlify
2. Konfigurišite build komande:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Dodajte environment varijable
4. Deploy

## 🔧 Troubleshooting

### Česti problemi

**1. Login ne radi**
- Provjerite da li je Supabase konfigurisan
- Provjerite environment varijable
- Provjerite da li su tabele kreirane u Supabase-u

**2. Testovi ne prolaze**
- Aplikacija koristi mock Supabase kada pravi nije konfigurisan
- Za testiranje sa pravim Supabase-om, konfigurišite environment varijable

**3. Build greške**
```bash
# Očistite cache
rm -rf .next
npm run build
```

**4. TypeScript greške**
```bash
# Provjerite tipove
npm run type-check
```

### Development vs Production

**Development (Mock Supabase)**
- Koristi mock podatke
- Ne zahtijeva Supabase konfiguraciju
- Idealno za development i testiranje

**Production (Pravi Supabase)**
- Zahtijeva Supabase konfiguraciju
- Koristi prave podatke
- Idealno za produkciju

## 📋 TODO

- [ ] Popraviti sve TypeScript greške
- [ ] Dodati error boundaries
- [ ] Implementirati offline support
- [ ] Dodati PWA funkcionalnosti
- [ ] Optimizovati performance
- [ ] Dodati više testova
- [ ] Implementirati real-time notifikacije

## 🤝 Contributing

1. Fork repozitorij
2. Kreirajte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit izmjene (`git commit -m 'Add some AmazingFeature'`)
4. Push na branch (`git push origin feature/AmazingFeature`)
5. Otvorite Pull Request

## 📄 License

Ovaj projekat je pod MIT licencom.

## 📞 Support

Za podršku, kontaktirajte development tim ili otvorite issue na GitHub-u. 