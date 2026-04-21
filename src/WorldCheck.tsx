import { useState, useMemo } from 'react'
import {
  Search,
  SlidersHorizontal,
  X,
  ExternalLink,
  Copy,
  Check,
  Download,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Globe,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Building2,
  User,
  FileText,
  Shield,
  History,
  Fingerprint,
  Briefcase,
  Flag,
  CalendarDays,
  RefreshCw,
  UserCircle,
  ShieldAlert,
  Link2,
} from 'lucide-react'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type EntityType = 'BANK' | 'DIPLOMAT' | 'ORGANIZATION' | 'INDIVIDUAL' | 'VESSEL' | 'STATE'
type RiskCategory =
  | 'Explicit Sanctions'
  | 'Travel or Visa Restriction'
  | 'Frozen and Seized Assets'
  | 'PEP'
  | 'Adverse Media'
  | 'Law Enforcement'

type PoliticalRole = { title: string; org: string; from: string; to: string }

type RelatedPerson = {
  name: string
  relation: string
  entityType?: EntityType
  riskTag?: RiskCategory | 'PEP'
  country?: string
  countryFlag?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

type WCEntity = {
  id: string
  name: string
  altNames: string[]
  matchPct: number
  entityType: EntityType
  country: string
  countryFlag: string
  dateAdded: string
  dateUpdated: string
  additionalInfo: string
  riskCategory: RiskCategory
  sources: string[]
  category: string
  subcategory: string
  status: 'ACTIVE' | 'INACTIVE'
  dateOfBirth?: string
  placeOfBirth?: string
  position?: string
  citizenship?: string
  relatedCompanies?: string
  locations?: string[]
  politicalRoles?: PoliticalRole[]
  fullInfo?: string
  relatedPersons?: RelatedPerson[]
}

type WCFilters = {
  q: string
  entityType: EntityType | 'ALL'
  country: string
  riskCategory: RiskCategory | 'ALL'
  minMatch: number
  sortBy: 'match' | 'dateAdded' | 'name'
  sortDir: 'desc' | 'asc'
}

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────
const ENTITIES: WCEntity[] = [
  {
    id: 'wc-001',
    name: 'ПАТ «Укргазбанк»',
    altNames: ['Ukrgasbank', 'Укргазбанк PJSC'],
    matchPct: 91,
    entityType: 'BANK',
    country: 'UKRAINE',
    countryFlag: '🇺🇦',
    dateAdded: '13-01-2023',
    dateUpdated: '13-01-2023',
    additionalInfo: 'Государственный банк Украины. Находится под наблюдением в рамках международного мониторинга финансовых операций.',
    riskCategory: 'Explicit Sanctions',
    sources: [
      'http://123.49.39.5/asset/pdfs/48/480001620171N.pdf',
      'http://123.49.39.5/asset/pdfs/48/480001620171N.pdf',
    ],
    category: 'FINANCIAL INSTITUTION',
    subcategory: 'STATE-OWNED BANK',
    status: 'ACTIVE',
    citizenship: 'UKRAINE',
    relatedCompanies: 'Ministry of Finance of Ukraine',
    locations: ['Kyiv, UKRAINE', 'Lviv, UKRAINE'],
    fullInfo: 'Государственный банк Украины, один из крупнейших финансовых учреждений страны. Находится под международным мониторингом в связи с санкционным режимом. Банк осуществляет широкий спектр финансовых услуг для физических и юридических лиц.',
    relatedPersons: [
      { name: 'Кирилл Шевченко', relation: 'Председатель правления', entityType: 'INDIVIDUAL', riskTag: 'PEP', country: 'UKRAINE', countryFlag: '🇺🇦', status: 'ACTIVE' },
      { name: 'Министерство финансов Украины', relation: 'Мажоритарный акционер', entityType: 'STATE', country: 'UKRAINE', countryFlag: '🇺🇦', status: 'ACTIVE' },
      { name: 'Ощадбанк', relation: 'Аффилированная структура', entityType: 'BANK', riskTag: 'Explicit Sanctions', country: 'UKRAINE', countryFlag: '🇺🇦', status: 'ACTIVE' },
    ],
  },
  {
    id: 'wc-002',
    name: 'Сейткали Бейбіт Ашимович',
    altNames: ['Beybut Seitkali', 'B.A. Сейткали', 'Beibut Seitkali'],
    matchPct: 28,
    entityType: 'DIPLOMAT',
    country: 'KAZAKHSTAN',
    countryFlag: '🇰🇿',
    dateAdded: '15-02-2022',
    dateUpdated: '15-02-2022',
    additionalInfo: 'Дипломатический представитель. Включён в базу данных международных организаций за нарушение режима санкций и участие в незаконных операциях.',
    riskCategory: 'Travel or Visa Restriction',
    sources: ['http://123.49.39.5/asset/pdfs/48/480001620171N.pdf'],
    category: 'POLITICAL INDIVIDUAL',
    subcategory: 'PEP N',
    status: 'INACTIVE',
    dateOfBirth: '12.07.1968',
    placeOfBirth: 'Алматы, Казахстан',
    position: 'Former Ambassador',
    citizenship: 'KAZAKHSTAN',
    relatedCompanies: 'Ministry of Foreign Affairs of Kazakhstan',
    locations: ['Astana, KAZAKHSTAN', 'Geneva, SWITZERLAND'],
    politicalRoles: [
      { title: 'Ambassador to Switzerland', org: 'Ministry of Foreign Affairs', from: '2010/03', to: '2014/09' },
      { title: 'Deputy Minister', org: 'Ministry of Foreign Affairs of Kazakhstan', from: '2015/01', to: '2018/06' },
    ],
    fullInfo: 'Бывший дипломатический представитель Казахстана в Швейцарии. Включён в международные санкционные базы в связи с предполагаемым нарушением ограничительных мер. В настоящее время лишён дипломатического статуса.',
    relatedPersons: [
      { name: 'Сейткали Ашим', relation: 'Отец', entityType: 'INDIVIDUAL', country: 'KAZAKHSTAN', countryFlag: '🇰🇿', status: 'INACTIVE' },
      { name: 'Беков Нурлан', relation: 'Помощник', entityType: 'INDIVIDUAL', riskTag: 'Adverse Media', country: 'KAZAKHSTAN', countryFlag: '🇰🇿', status: 'INACTIVE' },
    ],
  },
  {
    id: 'wc-003',
    name: 'ПАТ «ПриватБанк»',
    altNames: ['PrivatBank', 'ПриватБанк PJSC'],
    matchPct: 53,
    entityType: 'BANK',
    country: 'UKRAINE',
    countryFlag: '🇺🇦',
    dateAdded: '01-01-2021',
    dateUpdated: '01-01-2021',
    additionalInfo: 'Крупнейший банк в Украине, предоставляющий услуги физическим и юридическим лицам.',
    riskCategory: 'Frozen and Seized Assets',
    sources: [
      'http://123.49.39.5/asset/pdfs/48/480001620171N.pdf',
      'http://123.49.39.5/asset/pdfs/48/480001620171N.pdf',
    ],
    category: 'FINANCIAL INSTITUTION',
    subcategory: 'COMMERCIAL BANK',
    status: 'ACTIVE',
    citizenship: 'UKRAINE',
    relatedCompanies: 'National Bank of Ukraine',
    locations: ['Dnipro, UKRAINE', 'Kyiv, UKRAINE'],
    fullInfo: 'Крупнейший коммерческий банк Украины по количеству клиентов и активов. С 2016 года национализирован государством. Ряд активов банка заморожен в рамках международных расследований.',
  },
  {
    id: 'wc-004',
    name: 'ISLAM Syed Ashraful',
    altNames: ['ASHRAF,Syed', 'ASHRAFUL,Syed', 'ISLAM,Sayed Ashraful', 'ISLAM,Syed Asraful'],
    matchPct: 28,
    entityType: 'DIPLOMAT',
    country: 'BANGLADESH',
    countryFlag: '🇧🇩',
    dateAdded: '06-11-2000',
    dateUpdated: '08-04-2026',
    additionalInfo: 'Former Member of Legislature, Bangladesh. Included in international PEP databases due to political exposure and connections to sanctioned entities.',
    riskCategory: 'Explicit Sanctions',
    sources: [
      'http://123.49.39.5/asset/pdfs/48/480001620171N.pdf',
      'http://123.49.39.5/asset2013/pdfs/8_1_184_83_1.pdf',
    ],
    category: 'POLITICAL INDIVIDUAL',
    subcategory: 'PEP N',
    status: 'INACTIVE',
    dateOfBirth: '19.12.1959',
    placeOfBirth: 'Mymensingh, Bangladesh',
    position: 'Former Member of Legislature',
    citizenship: 'BANGLADESH',
    relatedCompanies: 'Virgo Group',
    locations: ['Dhaka, BANGLADESH', 'Rajshahi, BANGLADESH'],
    politicalRoles: [
      { title: 'Cabinet Minister', org: 'Minister of State of Civil Aviation and Tourism', from: '2001/01', to: '2001/07' },
      { title: 'Member of Parliament', org: 'Member of Parliament for Kishoreganj-1', from: '2001/08', to: '2003/12' },
      { title: 'Executive Director', org: 'National Tourism Board', from: '2004/01', to: '2007/05' },
      { title: 'Party Official', org: 'General Secretary of Bangladesh Awami League', from: '2007/06', to: '2011/11' },
    ],
    fullInfo: 'Member of Parliament for Kishoreganj-1 constituency (Jan 2009 - Dec 2018). Minister of Public Administration (Jul 2015 - Jan 2019). General Secretary of Bangladesh Awami League (Jul 2009 - Oct 2016). Minister of Local Government, Rural Development and Co-operatives (Jan 2009 - Jul 2015). [IDENTIFICATION] Sayeda Zakia Noor (PEP) (sister). Syed Shafayetul Islam (brother). [REPORTS] April 2026 - no further information reported.',
    relatedPersons: [
      { name: 'Sayeda Zakia Noor', relation: 'Сестра', entityType: 'INDIVIDUAL', riskTag: 'PEP', country: 'BANGLADESH', countryFlag: '🇧🇩', status: 'ACTIVE' },
      { name: 'Syed Shafayetul Islam', relation: 'Брат', entityType: 'INDIVIDUAL', country: 'BANGLADESH', countryFlag: '🇧🇩', status: 'INACTIVE' },
      { name: 'Syeda Reema Islam', relation: 'Дочь', entityType: 'INDIVIDUAL', country: 'BANGLADESH', countryFlag: '🇧🇩', status: 'INACTIVE' },
    ],
  },
  {
    id: 'wc-005',
    name: 'Газпромбанк АО',
    altNames: ['Gazprombank', 'GPB', 'JSC Gazprombank'],
    matchPct: 78,
    entityType: 'BANK',
    country: 'RUSSIA',
    countryFlag: '🇷🇺',
    dateAdded: '24-02-2022',
    dateUpdated: '15-01-2024',
    additionalInfo: 'Крупный государственный банк России. Введены ограничения ЕС, США и Великобритании в связи с геополитической ситуацией.',
    riskCategory: 'Explicit Sanctions',
    sources: [
      'http://123.49.39.5/asset/pdfs/48/480001620171N.pdf',
      'http://ofac.treasury.gov/sdn/gazprombank.pdf',
    ],
    category: 'FINANCIAL INSTITUTION',
    subcategory: 'STATE-OWNED BANK',
    status: 'ACTIVE',
    citizenship: 'RUSSIA',
    relatedCompanies: 'Газпром ПАО, ВЭБ.РФ',
    locations: ['Moscow, RUSSIA', 'St. Petersburg, RUSSIA'],
    fullInfo: 'Третий по величине банк в России, контролируется государством через Газпром. Включён в санкционные списки ЕС, США, Великобритании с 2022 года. Ограничения касаются межбанковских транзакций и торгового финансирования.',
    relatedPersons: [
      { name: 'Газпром ПАО', relation: 'Материнская компания', entityType: 'ORGANIZATION', riskTag: 'Explicit Sanctions', country: 'RUSSIA', countryFlag: '🇷🇺', status: 'ACTIVE' },
      { name: 'Андрей Акимов', relation: 'Председатель правления', entityType: 'INDIVIDUAL', riskTag: 'PEP', country: 'RUSSIA', countryFlag: '🇷🇺', status: 'INACTIVE' },
      { name: 'ВЭБ.РФ', relation: 'Аффилированная структура', entityType: 'STATE', riskTag: 'Explicit Sanctions', country: 'RUSSIA', countryFlag: '🇷🇺', status: 'ACTIVE' },
    ],
  },
  {
    id: 'wc-006',
    name: 'Reza Rahimi',
    altNames: ['Rahimi, Mohammad Reza', 'رضا رحیمی'],
    matchPct: 62,
    entityType: 'INDIVIDUAL',
    country: 'IRAN',
    countryFlag: '🇮🇷',
    dateAdded: '10-05-2019',
    dateUpdated: '03-03-2025',
    additionalInfo: 'Бывший первый вице-президент Ирана. Осуждён за хищение государственных средств. Включён в международные санкционные списки.',
    riskCategory: 'Law Enforcement',
    sources: ['http://123.49.39.5/asset/pdfs/48/480001620171N.pdf'],
    category: 'POLITICAL INDIVIDUAL',
    subcategory: 'PEP',
    status: 'INACTIVE',
    dateOfBirth: '09.03.1954',
    placeOfBirth: 'Tehran, Iran',
    position: 'Former First Vice President of Iran',
    citizenship: 'IRAN',
    locations: ['Tehran, IRAN'],
    politicalRoles: [
      { title: 'First Vice President', org: 'Government of Iran', from: '2009/09', to: '2013/08' },
      { title: 'Deputy Speaker', org: 'Islamic Consultative Assembly', from: '2000/05', to: '2004/05' },
    ],
    fullInfo: 'Mohammad Reza Rahimi served as First Vice President of Iran under President Ahmadinejad. Convicted by the Tehran Revolutionary Court on charges of embezzlement and money laundering. Assets frozen in several jurisdictions.',
    relatedPersons: [
      { name: 'Mahmoud Ahmadinejad', relation: 'Президент (бывший)', entityType: 'INDIVIDUAL', riskTag: 'PEP', country: 'IRAN', countryFlag: '🇮🇷', status: 'INACTIVE' },
      { name: 'Fatemeh Rahimi', relation: 'Супруга', entityType: 'INDIVIDUAL', country: 'IRAN', countryFlag: '🇮🇷', status: 'INACTIVE' },
    ],
  },
  {
    id: 'wc-007',
    name: 'Black Sea Shipping LLC',
    altNames: ['BSS LLC', 'Черноморское судоходство'],
    matchPct: 45,
    entityType: 'VESSEL',
    country: 'RUSSIA',
    countryFlag: '🇷🇺',
    dateAdded: '12-08-2023',
    dateUpdated: '20-11-2023',
    additionalInfo: 'Судоходная компания, связанная с обходом нефтяных санкций. Суда неоднократно фиксировались в запрещённых портах.',
    riskCategory: 'Adverse Media',
    sources: ['http://123.49.39.5/asset/pdfs/48/480001620171N.pdf'],
    category: 'VESSEL / MARITIME',
    subcategory: 'SHIPPING COMPANY',
    status: 'ACTIVE',
    citizenship: 'RUSSIA',
    locations: ['Novorossiysk, RUSSIA', 'Kerch, RUSSIA'],
    fullInfo: 'Компания осуществляет морские грузоперевозки по Чёрному и Каспийскому морям. Установлена причастность к транспортировке санкционных грузов. В отношении ряда судов введены ограничения на заход в порты ЕС.',
  },
]

const COUNTRIES = ['ALL', 'UKRAINE', 'KAZAKHSTAN', 'RUSSIA', 'BANGLADESH', 'IRAN']
const RISK_CATEGORIES: (RiskCategory | 'ALL')[] = ['ALL', 'Explicit Sanctions', 'Travel or Visa Restriction', 'Frozen and Seized Assets', 'PEP', 'Adverse Media', 'Law Enforcement']
const ENTITY_TYPES: (EntityType | 'ALL')[] = ['ALL', 'BANK', 'DIPLOMAT', 'ORGANIZATION', 'INDIVIDUAL', 'VESSEL', 'STATE']

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function matchConfig(pct: number) {
  if (pct >= 70) return { bar: 'bg-red-500', badge: 'bg-red-500/10 text-red-600 ring-red-200', ring: 'ring-red-400', label: 'Высокое' }
  if (pct >= 40) return { bar: 'bg-amber-400', badge: 'bg-amber-400/10 text-amber-600 ring-amber-200', ring: 'ring-amber-400', label: 'Среднее' }
  return { bar: 'bg-emerald-400', badge: 'bg-emerald-400/10 text-emerald-600 ring-emerald-200', ring: 'ring-emerald-400', label: 'Низкое' }
}

function riskConfig(cat: RiskCategory): { dot: string; badge: string } {
  const map: Record<RiskCategory, { dot: string; badge: string }> = {
    'Explicit Sanctions':      { dot: 'bg-red-500',    badge: 'bg-red-50 text-red-700 ring-red-200' },
    'Travel or Visa Restriction': { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 ring-orange-200' },
    'Frozen and Seized Assets':{ dot: 'bg-amber-500',  badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
    'PEP':                     { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 ring-purple-200' },
    'Adverse Media':           { dot: 'bg-slate-500',  badge: 'bg-slate-100 text-slate-700 ring-slate-200' },
    'Law Enforcement':         { dot: 'bg-rose-600',   badge: 'bg-rose-50 text-rose-700 ring-rose-200' },
  }
  return map[cat] ?? { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 ring-slate-200' }
}

function entityIcon(type: EntityType) {
  const cls = 'size-3'
  switch (type) {
    case 'BANK':       return <Building2 className={cls} />
    case 'DIPLOMAT':   return <Shield className={cls} />
    case 'INDIVIDUAL': return <User className={cls} />
    case 'VESSEL':     return <Globe className={cls} />
    case 'STATE':      return <Flag className={cls} />
    default:           return <Building2 className={cls} />
  }
}

function relativeDate(dateStr: string): string {
  const [d, m, y] = dateStr.split('-').map(Number)
  const diff = Date.now() - new Date(y, m - 1, d).getTime()
  const days = Math.floor(diff / 86400000)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  const remM = months % 12
  if (years > 0 && remM > 0) return `${years} г. ${remM} мес.`
  if (years > 0) return `${years} ${years < 5 ? 'года' : 'лет'}`
  if (months > 0) return `${months} мес.`
  return `${days} дн.`
}

// ─────────────────────────────────────────────
// CopyButton
// ─────────────────────────────────────────────
function CopyButton({ value, className = '' }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className={`inline-flex items-center transition ${className}`}
      title="Копировать"
    >
      {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5 text-slate-400 hover:text-blue-500" />}
    </button>
  )
}

// ─────────────────────────────────────────────
// ResultCard
// ─────────────────────────────────────────────
function ResultCard({ entity, bookmarked, onToggleBookmark, onClick }: {
  entity: WCEntity
  bookmarked: boolean
  onToggleBookmark: () => void
  onClick: () => void
}) {
  const mc = matchConfig(entity.matchPct)
  const rc = riskConfig(entity.riskCategory)
  const [rolesOpen, setRolesOpen] = useState(false)
  const hasPolitical = !!(entity.politicalRoles && entity.politicalRoles.length > 0)

  return (
    <article
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-blue-300 hover:shadow-md"
    >
      {/* accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${mc.bar}`} />

      <div className="pl-5 pr-5 py-5">
        {/* row 1 — name + badges */}
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-[15px] font-bold text-slate-900 leading-snug">{entity.name}</h3>
            {entity.altNames.length > 0 && (
              <p className="mt-0.5 text-[12px] text-slate-400 truncate">
                {entity.altNames.join(' · ')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* match pill */}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 ${mc.badge}`}>
              {entity.matchPct}%
              <span className="font-normal opacity-70">совпадение</span>
            </span>

            {/* type */}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
              {entityIcon(entity.entityType)}
              {entity.entityType}
            </span>

            {/* country */}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
              {entity.countryFlag} {entity.country}
            </span>

            {/* bookmark */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBookmark() }}
              className="rounded-lg p-1.5 text-slate-300 transition hover:bg-amber-50 hover:text-amber-500"
            >
              {bookmarked
                ? <BookmarkCheck className="size-4 text-amber-500" />
                : <Bookmark className="size-4" />}
            </button>
          </div>
        </div>

        {/* row 2 — meta */}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-slate-400" />
            Добавлено <strong className="text-slate-700">{entity.dateAdded}</strong>
            <span className="text-slate-400">({relativeDate(entity.dateAdded)} назад)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCw className="size-3.5 text-slate-400" />
            Обновлено <strong className="text-slate-700">{entity.dateUpdated}</strong>
          </span>
        </div>

        {/* row 3 — info */}
        <p className="mt-3 text-[13px] leading-relaxed text-slate-600 line-clamp-2">
          {entity.additionalInfo}
        </p>

        {/* row 4 — risk + political toggle + sources */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 ${rc.badge}`}>
              <span className={`size-1.5 rounded-full ${rc.dot}`} />
              {entity.riskCategory}
            </span>

            {hasPolitical && (
              <button
                onClick={(e) => { e.stopPropagation(); setRolesOpen((v) => !v) }}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 transition
                  ${rolesOpen
                    ? 'bg-purple-600 text-white ring-purple-600'
                    : 'bg-purple-50 text-purple-700 ring-purple-200 hover:bg-purple-100'}`}
              >
                <Briefcase className="size-3" />
                Политическое лицо
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold
                  ${rolesOpen ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-800'}`}>
                  {entity.politicalRoles!.length}
                </span>
                {rolesOpen
                  ? <ChevronUp className="size-3 ml-0.5" />
                  : <ChevronDown className="size-3 ml-0.5" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-[12px] text-slate-400">
            <Link2 className="size-3.5" />
            <span>{entity.sources.length} {entity.sources.length === 1 ? 'источник' : 'источника'}</span>
          </div>
        </div>
      </div>

      {/* Political roles expandable block */}
      {hasPolitical && rolesOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="border-t border-purple-100 bg-purple-50/60 px-5 py-4"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-purple-500">
            Политические должности
          </p>
          <div className="relative">
            {/* vertical timeline line */}
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-purple-200" />

            <div className="space-y-3 pl-5">
              {entity.politicalRoles!.map((role, i) => (
                <div key={i} className="relative">
                  {/* dot */}
                  <div className="absolute -left-5 top-1.5 size-2.5 rounded-full border-2 border-purple-400 bg-white" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 leading-snug">{role.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[12px] text-slate-500">
                        <Building2 className="size-3 shrink-0 text-slate-400" />
                        {role.org}
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full border border-purple-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-purple-600">
                      {role.from} — {role.to}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

// ─────────────────────────────────────────────
// DetailPanel
// ─────────────────────────────────────────────
function DetailPanel({ entity, onClose, onDownload, onSearch }: {
  entity: WCEntity
  onClose: () => void
  onDownload: () => void
  onSearch: (name: string) => void
}) {
  const mc = matchConfig(entity.matchPct)
  const rc = riskConfig(entity.riskCategory)

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-[700px] flex-col bg-white shadow-2xl">
        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 grid size-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
          >
            <X className="size-4" />
          </button>

          {/* match arc */}
          <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold ring-1 ${mc.badge} bg-white/10 ring-white/20 text-white`}>
            <span className={`size-2 rounded-full ${mc.bar}`} />
            {entity.matchPct}% совпадение · {mc.label} совпадение
          </div>

          <h2 className="text-[20px] font-bold text-white leading-tight pr-10">{entity.name}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {entityIcon(entity.entityType)}
              {entity.entityType}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {entity.countryFlag} {entity.country}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${rc.badge}`}>
              <span className={`size-1.5 rounded-full ${rc.dot}`} />
              {entity.riskCategory}
            </span>
            <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${entity.status === 'ACTIVE' ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-red-400/20 text-red-300 ring-1 ring-red-400/30'}`}>
              <span className={`size-1.5 rounded-full ${entity.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {entity.status}
            </span>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Basic info grid */}
          <section className="px-6 py-5 border-b border-slate-100">
            <SectionTitle icon={<Fingerprint className="size-4" />}>Основная информация</SectionTitle>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <DetailKv label="Категория" value={entity.category} />
              <DetailKv label="Подкатегория" value={entity.subcategory} />
              {entity.dateOfBirth && <DetailKv label="Дата рождения" value={entity.dateOfBirth} />}
              {entity.placeOfBirth && <DetailKv label="Место рождения" value={entity.placeOfBirth} />}
              {entity.position && <DetailKv label="Должность" value={entity.position} />}
              {entity.citizenship && <DetailKv label="Гражданство" value={entity.citizenship} />}
              {entity.relatedCompanies && <DetailKv label="Связанные компании" value={entity.relatedCompanies} colSpan />}
              <DetailKv label="Дата добавления" value={entity.dateAdded} />
              <DetailKv label="Дата обновления" value={entity.dateUpdated} />
            </div>

            {entity.locations && entity.locations.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Локации</p>
                <div className="flex flex-wrap gap-2">
                  {entity.locations.map((loc) => (
                    <span key={loc} className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] font-medium text-blue-700">
                      <MapPin className="size-3" />
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entity.altNames.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Альтернативные имена</p>
                <div className="flex flex-wrap gap-1.5">
                  {entity.altNames.map((n) => (
                    <span key={n} className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] text-slate-600">{n}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Political roles */}
          {entity.politicalRoles && entity.politicalRoles.length > 0 && (
            <section className="px-6 py-5 border-b border-slate-100">
              <SectionTitle icon={<Briefcase className="size-4" />}>Политическое лицо</SectionTitle>
              <div className="mt-4 space-y-2">
                {entity.politicalRoles.map((role, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">{role.title}</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">{role.org}</p>
                    </div>
                    <span className="ml-4 shrink-0 rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-500">
                      {role.from} — {role.to}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Full info */}
          {entity.fullInfo && (
            <section className="px-6 py-5 border-b border-slate-100">
              <SectionTitle icon={<FileText className="size-4" />}>Дополнительная информация</SectionTitle>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{entity.fullInfo}</p>
            </section>
          )}

          {/* Related persons */}
          {entity.relatedPersons && entity.relatedPersons.length > 0 && (
            <section className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <SectionTitle icon={<UserCircle className="size-4" />}>Связанные лица</SectionTitle>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                  {entity.relatedPersons.length}
                </span>
              </div>
              <div className="space-y-2">
                {entity.relatedPersons.map((p, i) => {
                  const hasRisk = !!p.riskTag
                  const riskCfg = hasRisk ? riskConfig(p.riskTag as RiskCategory) : null
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-slate-200 hover:bg-white">
                      {/* Avatar */}
                      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-[12px] font-bold text-slate-600">
                        {p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-semibold text-slate-900 truncate">{p.name}</span>
                          {p.countryFlag && (
                            <span className="text-[11px] text-slate-400">{p.countryFlag}</span>
                          )}
                          {hasRisk && riskCfg && (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${riskCfg.badge}`}>
                              <span className={`size-1.5 rounded-full ${riskCfg.dot}`} />
                              {p.riskTag}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">{p.relation}</span>
                          {p.entityType && (
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">· {p.entityType}</span>
                          )}
                          {p.status && (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${p.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                              <span className={`size-1.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                              {p.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => { onSearch(p.name); onClose() }}
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Проверить
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Sources */}
          <section className="px-6 py-5">
            <SectionTitle icon={<ExternalLink className="size-4" />}>Источники</SectionTitle>
            <div className="mt-3 space-y-2">
              {entity.sources.map((src, i) => (
                <a
                  key={i}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-[12px] text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <ExternalLink className="size-3.5 shrink-0 text-blue-400" />
                  <span className="truncate">{src}</span>
                </a>
              ))}
            </div>
          </section>

          <div className="h-4" />
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Закрыть
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Download className="size-4" />
            Скачать отчёт
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
      <span className="text-slate-400">{icon}</span>
      {children}
    </div>
  )
}

function DetailKv({ label, value, colSpan }: { label: string; value: string; colSpan?: boolean }) {
  return (
    <div className={colSpan ? 'col-span-2' : ''}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium text-slate-800">{value}</p>
    </div>
  )
}

// ─────────────────────────────────────────────
// DownloadModal
// ─────────────────────────────────────────────
function DownloadModal({ entity, onClose }: { entity: WCEntity; onClose: () => void }) {
  const [format, setFormat] = useState<'pdf' | 'docx' | 'xlsx'>('pdf')
  const [downloading, setDownloading] = useState(false)
  const [done, setDone] = useState(false)

  const handle = () => {
    setDownloading(true)
    setTimeout(() => { setDownloading(false); setDone(true) }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[16px] font-bold text-slate-900">Скачать отчёт</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="size-4" /></button>
        </div>
        <p className="text-[12px] text-slate-500 mb-4">Объект: <span className="font-semibold text-slate-700">{entity.name}</span></p>

        <div className="space-y-2">
          {(['pdf', 'docx', 'xlsx'] as const).map((f) => (
            <label key={f} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${format === f ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" checked={format === f} onChange={() => setFormat(f)} className="accent-blue-600" />
              <FileText className="size-4 text-slate-400" />
              <div>
                <p className="text-[13px] font-semibold text-slate-800">{f.toUpperCase()}</p>
                <p className="text-[11px] text-slate-400">{f === 'pdf' ? 'Портативный документ' : f === 'docx' ? 'Word-документ' : 'Excel-таблица'}</p>
              </div>
            </label>
          ))}
        </div>

        {done ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700 ring-1 ring-emerald-200">
            <Check className="size-4" />
            <span className="text-[13px] font-semibold">Отчёт сформирован и скачан</span>
          </div>
        ) : (
          <button
            onClick={handle}
            disabled={downloading}
            className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {downloading ? 'Формирование...' : `Скачать ${format.toUpperCase()}`}
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// FilterSelect
// ─────────────────────────────────────────────
function FilterSelect({ label, value, options, onChange }: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main WorldCheckPage
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Hero Illustration
// ─────────────────────────────────────────────
function WorldCheckIllustration() {
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="glowBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B82F6" floodOpacity="0.25" />
        </filter>
        <filter id="shadowSm" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <clipPath id="globeClip">
          <circle cx="90" cy="100" r="62" />
        </clipPath>
      </defs>

      {/* Outer glow */}
      <circle cx="90" cy="100" r="80" fill="url(#glowBlue)" opacity="0.4" />

      {/* Globe body */}
      <circle cx="90" cy="100" r="62" fill="url(#globeGrad)" stroke="#BFDBFE" strokeWidth="1.5" filter="url(#shadow)" />

      {/* Latitude lines */}
      {[-30, 0, 30].map((offset, i) => (
        <ellipse key={i} cx="90" cy={100 + offset} rx="62" ry={12 + Math.abs(offset) * 0.3}
          fill="none" stroke="#93C5FD" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5"
          clipPath="url(#globeClip)" />
      ))}

      {/* Longitude lines */}
      {[-40, -20, 0, 20, 40].map((offset, i) => (
        <ellipse key={i} cx={90 + offset} cy="100" rx={10 + Math.abs(offset) * 0.2} ry="62"
          fill="none" stroke="#93C5FD" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4"
          clipPath="url(#globeClip)" />
      ))}

      {/* Equator */}
      <ellipse cx="90" cy="100" rx="62" ry="10" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.6" clipPath="url(#globeClip)" />
      {/* Prime meridian */}
      <ellipse cx="90" cy="100" rx="10" ry="62" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.6" clipPath="url(#globeClip)" />

      {/* Continent blobs */}
      <g clipPath="url(#globeClip)" opacity="0.55">
        <path d="M60 82 Q68 72 80 75 Q88 78 85 88 Q80 95 70 92 Q58 90 60 82Z" fill="#3B82F6" opacity="0.5" />
        <path d="M95 78 Q105 70 115 76 Q122 83 118 92 Q110 98 100 94 Q92 88 95 78Z" fill="#6366F1" opacity="0.4" />
        <path d="M65 108 Q72 100 82 104 Q88 110 84 120 Q76 126 67 120 Q60 114 65 108Z" fill="#3B82F6" opacity="0.4" />
        <path d="M100 105 Q108 98 116 103 Q122 110 118 118 Q112 124 104 120 Q97 114 100 105Z" fill="#818CF8" opacity="0.35" />
        <path d="M82 118 Q86 112 94 115 Q98 120 95 128 Q90 132 84 129 Q80 124 82 118Z" fill="#60A5FA" opacity="0.4" />
      </g>

      {/* Globe ring */}
      <circle cx="90" cy="100" r="62" fill="none" stroke="#93C5FD" strokeWidth="1.5" opacity="0.8" />

      {/* Location pin dot 1 */}
      <circle cx="78" cy="83" r="3.5" fill="#F59E0B" filter="url(#shadowSm)" />
      <circle cx="78" cy="83" r="6" fill="#F59E0B" opacity="0.2" />

      {/* Location pin dot 2 */}
      <circle cx="108" cy="95" r="3" fill="#EF4444" filter="url(#shadowSm)" />
      <circle cx="108" cy="95" r="5.5" fill="#EF4444" opacity="0.2" />

      {/* Connection line between pins */}
      <path d="M78 83 Q93 74 108 95" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />

      {/* ── Magnifying glass ── */}
      <g filter="url(#shadow)">
        <circle cx="152" cy="62" r="26" fill="white" />
        <circle cx="152" cy="62" r="16" fill="none" stroke="#3B82F6" strokeWidth="3" />
        <line x1="163" y1="73" x2="173" y2="83" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
        {/* search inner highlight */}
        <circle cx="147" cy="57" r="4" fill="#BFDBFE" opacity="0.6" />
      </g>

      {/* ── Document card ── */}
      <g filter="url(#shadowSm)">
        <rect x="4" y="56" width="56" height="72" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1" />
        {/* doc header */}
        <rect x="4" y="56" width="56" height="18" rx="8" fill="#EFF6FF" />
        <rect x="4" y="68" width="56" height="6" rx="0" fill="#EFF6FF" />
        {/* lines */}
        <rect x="12" y="84" width="36" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="12" y="91" width="28" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="12" y="98" width="32" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="12" y="105" width="22" height="3" rx="1.5" fill="#CBD5E1" />
        {/* badge */}
        <rect x="12" y="114" width="36" height="6" rx="3" fill="#FEE2E2" />
        <circle cx="18" cy="117" r="2" fill="#EF4444" />
        <rect x="22" y="115.5" width="20" height="3" rx="1.5" fill="#FCA5A5" />
      </g>

      {/* ── Shield badge ── */}
      <g filter="url(#shadowSm)">
        <path d="M156 126 L156 148 Q156 160 168 166 Q180 160 180 148 L180 126 L168 120 Z"
          fill="#EEF2FF" stroke="#818CF8" strokeWidth="1.5" />
        <path d="M162 143 L166 147 L175 136" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ── Risk alert chip ── */}
      <g filter="url(#shadowSm)">
        <rect x="108" y="148" width="76" height="26" rx="13" fill="white" stroke="#FEE2E2" strokeWidth="1.5" />
        <circle cx="124" cy="161" r="6" fill="#FEF2F2" />
        <path d="M124 157 L124 162" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="124" cy="164.5" r="1" fill="#EF4444" />
        <rect x="134" y="157" width="42" height="3" rx="1.5" fill="#FCA5A5" />
        <rect x="134" y="163" width="28" height="3" rx="1.5" fill="#FECACA" />
      </g>

      {/* Floating dots */}
      <circle cx="38" cy="46" r="3" fill="#93C5FD" opacity="0.6" />
      <circle cx="185" cy="105" r="2.5" fill="#818CF8" opacity="0.5" />
      <circle cx="25" cy="145" r="2" fill="#60A5FA" opacity="0.4" />
      <circle cx="200" cy="145" r="2" fill="#F59E0B" opacity="0.4" />
    </svg>
  )
}

export function WorldCheckPage() {
  const [inputQ, setInputQ] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<WCFilters>({
    q: '', entityType: 'ALL', country: 'ALL', riskCategory: 'ALL',
    minMatch: 0, sortBy: 'match', sortDir: 'desc',
  })
  const [detailId, setDetailId] = useState<string | null>(null)
  const [downloadId, setDownloadId] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const detailEntity = detailId ? ENTITIES.find((e) => e.id === detailId) ?? null : null
  const downloadEntity = downloadId ? ENTITIES.find((e) => e.id === downloadId) ?? null : null

  const handleSearch = () => {
    if (!inputQ.trim()) return
    setFilters((f) => ({ ...f, q: inputQ.trim() }))
    setSearchHistory((h) => [inputQ.trim(), ...h.filter((x) => x !== inputQ.trim())].slice(0, 8))
    setSubmitted(true)
    setShowHistory(false)
  }

  const handleReset = () => { setInputQ(''); setSubmitted(false); setFilters((f) => ({ ...f, q: '' })) }

  const results = useMemo(() => {
    if (!submitted) return []
    let list = ENTITIES.filter((e) => {
      const q = filters.q.toLowerCase()
      const matchQ = !q || e.name.toLowerCase().includes(q) || e.altNames.some((a) => a.toLowerCase().includes(q)) || e.country.toLowerCase().includes(q)
      return matchQ
        && (filters.entityType === 'ALL' || e.entityType === filters.entityType)
        && (filters.country === 'ALL' || e.country === filters.country)
        && (filters.riskCategory === 'ALL' || e.riskCategory === filters.riskCategory)
        && e.matchPct >= filters.minMatch
    })
    list.sort((a, b) => {
      const cmp = filters.sortBy === 'match' ? a.matchPct - b.matchPct
        : filters.sortBy === 'name' ? a.name.localeCompare(b.name, 'ru')
        : a.dateAdded.localeCompare(b.dateAdded)
      return filters.sortDir === 'desc' ? -cmp : cmp
    })
    return list
  }, [submitted, filters])

  return (
    <main className="mx-auto max-w-[1040px] space-y-6 px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-slate-400">
        <span>Главная</span><span>/</span>
        <span className="font-semibold text-slate-700">WorldCheck</span>
      </nav>

      {/* Page title */}
      <div>
        <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Международная проверка</h1>
        <p className="mt-1 text-[14px] text-slate-500">Санкционные списки, PEP, Adverse Media и другие международные реестры</p>
      </div>

      {/* Hero + Search card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Feature strip */}
        <div className="flex flex-col gap-6 p-7 md:flex-row md:items-start">
          <div className="flex-1 space-y-4">
            <h2 className="text-[18px] font-bold text-slate-900">WorldCheck</h2>
            <p className="text-[13px] leading-relaxed text-slate-500">
              Быстрая оценка благонадёжности физических и юридических лиц по международным источникам риска — санкционные списки, базы PEP, негативные упоминания и другие реестры за считанные секунды.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: <ShieldAlert className="size-4" />, title: 'Охват источников', desc: 'Санкции, PEP, Adverse Media, OFAC, EU, UN' },
                { icon: <Search className="size-4" />, title: 'Оперативный поиск', desc: 'Авто-сопоставление по имени и компании' },
                { icon: <FileText className="size-4" />, title: 'Структурированный результат', desc: 'Источник, тип риска и контекст' },
              ].map((f) => (
                <div key={f.title} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-blue-500">{f.icon}</span>
                  <div>
                    <p className="text-[12px] font-bold text-slate-800">{f.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden md:block shrink-0">
            <img src="/adata-investigations/wc-hero.png" alt="" width={220} height={200} className="select-none" draggable={false} />
          </div>
        </div>

        {/* Search bar */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-7 py-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                value={inputQ}
                onChange={(e) => setInputQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 150)}
                placeholder="Введите наименование организации или ФИО"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-[14px] text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {inputQ && (
                <button onClick={handleReset} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600">
                  <X className="size-4" />
                </button>
              )}
              {showHistory && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <History className="size-3" /> Недавние запросы
                  </div>
                  {searchHistory.map((h) => (
                    <button
                      key={h}
                      onMouseDown={() => { setInputQ(h); setShowHistory(false) }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Search className="size-3.5 text-slate-400" />
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-3 text-[13px] font-semibold shadow-sm transition ${filtersOpen ? 'border-blue-400 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
            >
              <SlidersHorizontal className="size-4" />
              Фильтры
              {filtersOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
            <button
              onClick={handleSearch}
              className="rounded-xl bg-blue-600 px-6 py-3 text-[14px] font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              Найти
            </button>
          </div>

          {/* Advanced filters */}
          {filtersOpen && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <FilterSelect label="Тип субъекта" value={filters.entityType}
                  options={ENTITY_TYPES.map((t) => ({ value: t, label: t === 'ALL' ? 'Все типы' : t }))}
                  onChange={(v) => setFilters((f) => ({ ...f, entityType: v as EntityType | 'ALL' }))} />
                <FilterSelect label="Страна" value={filters.country}
                  options={COUNTRIES.map((c) => ({ value: c, label: c === 'ALL' ? 'Все страны' : c }))}
                  onChange={(v) => setFilters((f) => ({ ...f, country: v }))} />
                <FilterSelect label="Категория риска" value={filters.riskCategory}
                  options={RISK_CATEGORIES.map((r) => ({ value: r, label: r === 'ALL' ? 'Все категории' : r }))}
                  onChange={(v) => setFilters((f) => ({ ...f, riskCategory: v as RiskCategory | 'ALL' }))} />
                <FilterSelect label="Мин. совпадение" value={String(filters.minMatch)}
                  options={[0, 20, 40, 60, 80].map((t) => ({ value: String(t), label: t === 0 ? 'Любое' : `≥ ${t}%` }))}
                  onChange={(v) => setFilters((f) => ({ ...f, minMatch: Number(v) }))} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Сортировка:</span>
                  {(['match', 'dateAdded', 'name'] as const).map((s) => (
                    <button key={s}
                      onClick={() => setFilters((f) => ({ ...f, sortBy: s, sortDir: f.sortBy === s && f.sortDir === 'desc' ? 'asc' : 'desc' }))}
                      className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${filters.sortBy === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {s === 'match' ? '% совпадение' : s === 'dateAdded' ? 'Дата' : 'Название'}
                      {filters.sortBy === s && <span className="ml-1">{filters.sortDir === 'desc' ? '↓' : '↑'}</span>}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setFilters((f) => ({ ...f, entityType: 'ALL', country: 'ALL', riskCategory: 'ALL', minMatch: 0 }))}
                  className="text-[12px] font-medium text-slate-400 hover:text-red-500 transition"
                >
                  Сбросить
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {submitted && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-bold text-slate-900">Результаты поиска</h2>
              <p className="text-[13px] text-slate-500">
                Найдено <span className="font-bold text-slate-800">{results.length}</span>
                {filters.q && <> по запросу «<span className="font-semibold text-blue-600">{filters.q}</span>»</>}
              </p>
            </div>
            {bookmarks.size > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[12px] font-semibold text-amber-700">
                <BookmarkCheck className="size-3.5" />
                Отслеживается: {bookmarks.size}
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <AlertTriangle className="size-10 text-slate-300" />
              <div>
                <p className="text-[15px] font-semibold text-slate-500">Совпадений не найдено</p>
                <p className="text-[13px] text-slate-400 mt-1">Попробуйте изменить запрос или сбросить фильтры</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((e) => (
                <ResultCard
                  key={e.id}
                  entity={e}
                  bookmarked={bookmarks.has(e.id)}
                  onToggleBookmark={() => setBookmarks((prev) => { const n = new Set(prev); n.has(e.id) ? n.delete(e.id) : n.add(e.id); return n })}
                  onClick={() => setDetailId(e.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {detailEntity && (
        <DetailPanel
          entity={detailEntity}
          onClose={() => setDetailId(null)}
          onDownload={() => setDownloadId(detailEntity.id)}
          onSearch={(name) => {
            setInputQ(name)
            setFilters((f) => ({ ...f, q: name }))
            setSearchHistory((h) => [name, ...h.filter((x) => x !== name)].slice(0, 8))
            setSubmitted(true)
            setDetailId(null)
          }}
        />
      )}
      {downloadEntity && (
        <DownloadModal entity={downloadEntity} onClose={() => setDownloadId(null)} />
      )}
    </main>
  )
}
