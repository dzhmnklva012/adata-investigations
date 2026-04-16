import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  BadgeCheck,
  Bell,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileSignature,
  FileText,
  History,
  Info,
  LayoutGrid,
  Link2,
  Lock,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  PenLine,
  Play,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  StickyNote,
  Table2,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from 'lucide-react'

// ===================== Types =====================
type Status = 'draft' | 'progress' | 'completed' | 'signed'

type Person = {
  id: string
  type: 'employee' | 'external'
  fullName: string
  iinBin: string
  role?: string
  department?: string
}

type Complaint = {
  id: string
  number: string
  topic: string
  responsible: string
  date: string
  channel: string
}

type Attachment = {
  id: string
  name: string
  size: string
  kind: 'PDF' | 'XLS' | 'DOC' | 'IMG'
}

type Note = {
  id: string
  author: string
  when: string
  body: string
}

type HistoryEntry = { when: string; who: string; action: string }

type Investigation = {
  id: string
  number: string
  goal: string
  violationType: string
  eventDate: string
  location: string
  description: string
  responsible: { name: string; role: string }
  status: Status
  createdDate: string
  updatedAt: string
  persons: Person[]
  complaints: Complaint[]
  attachments: Attachment[]
  result?: string
  recommendations?: string
  verdict?: 'confirmed' | 'rejected'
  severity?: 'low' | 'mid' | 'high'
  signedAt?: string
  signedBy?: string
  signature?: { cert: string; hash: string; validUntil: string }
  notes: Note[]
  history: HistoryEntry[]
}

// ===================== Status config =====================
const STATUS: Record<
  Status,
  { label: string; chipBg: string; chipText: string; dot: string }
> = {
  draft: { label: 'Черновик', chipBg: 'bg-slate-100', chipText: 'text-slate-700', dot: 'bg-slate-500' },
  progress: { label: 'В работе', chipBg: 'bg-amber-50', chipText: 'text-amber-800', dot: 'bg-amber-500' },
  completed: { label: 'Завершено', chipBg: 'bg-emerald-50', chipText: 'text-emerald-800', dot: 'bg-emerald-500' },
  signed: { label: 'Подписано ЭЦП', chipBg: 'bg-indigo-50', chipText: 'text-indigo-800', dot: 'bg-indigo-500' },
}

const VIOLATION_TYPES = [
  'Информационная безопасность',
  'Конфликт интересов',
  'Кадровое нарушение',
  'Хищение / мошенничество',
  'Этика и поведение',
  'Антикоррупция',
  'Охрана труда',
  'Финансовые нарушения',
]

// ===================== Sample data =====================
const SAMPLE: Investigation[] = [
  {
    id: 'inv-0148',
    number: 'INV-2026-0148',
    goal: 'Утечка персональных данных клиентов через CRM',
    violationType: 'Информационная безопасность',
    eventDate: '12.04.2026',
    location: 'Алматы, головной офис',
    description:
      'Зафиксирован факт несанкционированной выгрузки клиентской базы CRM-системы во внешний носитель сотрудником отдела продаж 12.04.2026 в 23:14. Размер выгрузки — 18 400 записей. Требуется установить причастных лиц, оценить масштаб утечки, провести интервью с администратором БД и предложить корректирующие меры.',
    responsible: { name: 'А. Касымова', role: 'Compliance' },
    status: 'progress',
    createdDate: '12.04.2026',
    updatedAt: 'сегодня, 14:32',
    persons: [
      { id: 'p1', type: 'employee', fullName: 'Иванов Сергей Петрович', iinBin: '880512300456', role: 'Менеджер CRM', department: 'Отдел продаж' },
      { id: 'p2', type: 'employee', fullName: 'Сулейменова Айгуль Маратовна', iinBin: '910823400789', role: 'Администратор БД', department: 'ИТ' },
      { id: 'p3', type: 'external', fullName: 'ТОО «ДатаКлауд Сервис»', iinBin: '180440012345', role: 'Подрядчик' },
    ],
    complaints: [
      { id: 'c1', number: 'HL-2026-00921', topic: 'Сообщение о возможной утечке клиентской базы из CRM', responsible: 'А. Касымова', date: '08.04.2026', channel: 'Горячая линия' },
      { id: 'c2', number: 'HL-2026-00917', topic: 'Жалоба сотрудника на нарушение политики обработки ПДн', responsible: 'А. Касымова', date: '05.04.2026', channel: 'Email' },
    ],
    attachments: [
      { id: 'a1', name: 'Журнал_доступа_CRM_апрель.xlsx', size: '248 КБ', kind: 'XLS' },
      { id: 'a2', name: 'Объяснительная_Иванов.pdf', size: '1.2 МБ', kind: 'PDF' },
      { id: 'a3', name: 'Скриншот_лога.png', size: '524 КБ', kind: 'IMG' },
    ],
    notes: [
      { id: 'n1', author: 'А. Касымова', when: 'сегодня, 14:32', body: 'Запрошены логи доступа к CRM за период 10–12.04. Назначена встреча с администратором БД на 16.04.' },
      { id: 'n2', author: 'Д. Ермеков', when: 'вчера, 17:08', body: 'Подтверждена связь с двумя жалобами с горячей линии. Инициирован сбор объяснительных.' },
    ],
    history: [
      { when: '12.04.2026, 16:30', who: 'А. Касымова', action: 'Добавлены 2 связанные персоны' },
      { when: '12.04.2026, 10:02', who: 'А. Касымова', action: 'Изменён статус: Черновик → В работе' },
      { when: '12.04.2026, 09:15', who: 'А. Касымова', action: 'Расследование создано' },
    ],
  },
  {
    id: 'inv-0147',
    number: 'INV-2026-0147',
    goal: 'Конфликт интересов в тендерной комиссии №34',
    violationType: 'Конфликт интересов',
    eventDate: '10.04.2026',
    location: 'Астана, центральный офис',
    description: 'Поступили сведения о возможной аффилированности члена тендерной комиссии с одним из участников закупочной процедуры.',
    responsible: { name: 'Д. Ермеков', role: 'Аудит' },
    status: 'progress',
    createdDate: '10.04.2026',
    updatedAt: 'вчера, 19:12',
    persons: [],
    complaints: [],
    attachments: [],
    notes: [],
    history: [{ when: '10.04.2026, 09:10', who: 'Д. Ермеков', action: 'Расследование создано' }],
  },
  {
    id: 'inv-0146',
    number: 'INV-2026-0146',
    goal: 'Нарушение трудовой дисциплины — отдел продаж',
    violationType: 'Кадровое нарушение',
    eventDate: '08.04.2026',
    location: 'Шымкент, филиал',
    description: 'Зафиксирована серия нарушений правил внутреннего трудового распорядка двумя сотрудниками отдела продаж в период с 15.03.2026 по 05.04.2026.',
    responsible: { name: 'М. Алиева', role: 'HR' },
    status: 'signed',
    createdDate: '08.04.2026',
    updatedAt: '14.04.2026, 10:24',
    persons: [
      { id: 'p1', type: 'employee', fullName: 'Петров А.В.', iinBin: '900312400123', role: 'Менеджер', department: 'Отдел продаж' },
      { id: 'p2', type: 'employee', fullName: 'Сидорова Е.Н.', iinBin: '920718500456', role: 'Менеджер', department: 'Отдел продаж' },
    ],
    complaints: [
      { id: 'c1', number: 'HL-2026-00889', topic: 'Жалоба на регулярные опоздания коллег', responsible: 'М. Алиева', date: '01.04.2026', channel: 'Горячая линия' },
    ],
    attachments: [
      { id: 'a1', name: 'Табель_учёта_рабочего_времени.xlsx', size: '312 КБ', kind: 'XLS' },
      { id: 'a2', name: 'Отчёт_INV-2026-0146_подписан.pdf', size: '3.4 МБ', kind: 'PDF' },
    ],
    result:
      'Подтверждено систематическое нарушение правил внутреннего трудового распорядка двумя сотрудниками отдела продаж в период с 15.03.2026 по 05.04.2026: опоздания, отсутствие на рабочем месте без уважительной причины, невыполнение установленных KPI.',
    recommendations:
      '1. Объявить дисциплинарное взыскание (выговор) обоим сотрудникам с занесением в личное дело.\n2. Провести повторный инструктаж по правилам внутреннего трудового распорядка для всего отдела продаж в срок до 25.04.2026.\n3. Внедрить ежемесячный мониторинг выполнения KPI с отчётностью руководителю отдела.\n4. Пересмотреть систему мотивации с учётом дисциплинарных показателей до 15.05.2026.',
    verdict: 'confirmed',
    severity: 'mid',
    signedAt: '14.04.2026, 10:24',
    signedBy: 'М. Алиева',
    signature: { cert: 'KZ-2026-AKM-7821', hash: '8f3a…d12c', validUntil: '18.07.2027' },
    notes: [],
    history: [
      { when: '14.04.2026, 10:24', who: 'М. Алиева', action: 'Отчёт подписан ЭЦП' },
      { when: '14.04.2026, 09:48', who: 'М. Алиева', action: 'Расследование завершено, заполнены результаты' },
      { when: '12.04.2026, 16:30', who: 'М. Алиева', action: 'Добавлены 2 связанные персоны' },
      { when: '10.04.2026, 11:02', who: 'М. Алиева', action: 'Изменён статус: Черновик → В работе' },
      { when: '08.04.2026, 14:15', who: 'М. Алиева', action: 'Расследование создано' },
    ],
  },
  {
    id: 'inv-0145',
    number: 'INV-2026-0145',
    goal: 'Хищение товарно-материальных ценностей со склада',
    violationType: 'Хищение / мошенничество',
    eventDate: '05.04.2026',
    location: 'Караганда, склад №2',
    description: 'Выявлена недостача ТМЦ на сумму 4.8 млн тг по результатам плановой инвентаризации.',
    responsible: { name: 'Н. Турсунов', role: 'СБ' },
    status: 'completed',
    createdDate: '05.04.2026',
    updatedAt: '13.04.2026, 16:00',
    persons: [],
    complaints: [],
    attachments: [],
    result: 'Факт хищения подтверждён. Виновные лица установлены по результатам инвентаризации и анализа видеозаписей.',
    recommendations: 'Усилить пропускной режим, установить дополнительные камеры видеонаблюдения, провести служебную проверку по кладовщикам.',
    verdict: 'confirmed',
    severity: 'high',
    notes: [],
    history: [],
  },
  {
    id: 'inv-0144',
    number: 'INV-2026-0144',
    goal: 'Жалоба на дискриминацию по горячей линии',
    violationType: 'Этика и поведение',
    eventDate: '03.04.2026',
    location: 'Удалённо',
    description: 'Сотрудник заявил о предвзятом отношении со стороны руководителя.',
    responsible: { name: 'А. Касымова', role: 'Compliance' },
    status: 'progress',
    createdDate: '03.04.2026',
    updatedAt: 'вчера, 11:20',
    persons: [],
    complaints: [],
    attachments: [],
    notes: [],
    history: [],
  },
  {
    id: 'inv-0143',
    number: 'INV-2026-0143',
    goal: 'Подозрение на коррупционные действия закупщика',
    violationType: 'Антикоррупция',
    eventDate: '30.03.2026',
    location: 'Алматы, головной офис',
    description: 'Установлены признаки получения вознаграждения за принятие решений в пользу конкретного поставщика.',
    responsible: { name: 'Д. Ермеков', role: 'Аудит' },
    status: 'signed',
    createdDate: '30.03.2026',
    updatedAt: '11.04.2026, 12:14',
    persons: [],
    complaints: [],
    attachments: [],
    result: 'Факт подтверждён. Материалы переданы в правоохранительные органы.',
    recommendations: 'Пересмотреть процедуру утверждения поставщиков, ввести двойное согласование закупок свыше 10 млн тг.',
    verdict: 'confirmed',
    severity: 'high',
    signedAt: '11.04.2026, 12:14',
    signedBy: 'Д. Ермеков',
    signature: { cert: 'KZ-2026-DE-4431', hash: '2c91…a47b', validUntil: '22.09.2027' },
    notes: [],
    history: [],
  },
  {
    id: 'inv-0142',
    number: 'INV-2026-0142',
    goal: 'Неавторизованный доступ к финансовым отчётам',
    violationType: 'Информационная безопасность',
    eventDate: '28.03.2026',
    location: 'Астана, центральный офис',
    description: 'Обнаружены попытки несанкционированного доступа к закрытым финансовым документам.',
    responsible: { name: 'С. Жумабаев', role: 'ИБ' },
    status: 'draft',
    createdDate: '28.03.2026',
    updatedAt: '28.03.2026, 17:40',
    persons: [],
    complaints: [],
    attachments: [],
    notes: [],
    history: [{ when: '28.03.2026, 17:40', who: 'С. Жумабаев', action: 'Черновик создан' }],
  },
  {
    id: 'inv-0141',
    number: 'INV-2026-0141',
    goal: 'Нарушение охраны труда на производственной линии',
    violationType: 'Охрана труда',
    eventDate: '25.03.2026',
    location: 'Павлодар, завод',
    description: 'Несчастный случай без тяжких последствий. Требуется установить причины.',
    responsible: { name: 'Н. Турсунов', role: 'СБ' },
    status: 'completed',
    createdDate: '25.03.2026',
    updatedAt: '09.04.2026, 10:00',
    persons: [],
    complaints: [],
    attachments: [],
    result: 'Причиной стало несоблюдение регламента эксплуатации оборудования.',
    recommendations: 'Провести внеочередной инструктаж по ТБ на всех производственных линиях.',
    verdict: 'confirmed',
    severity: 'mid',
    notes: [],
    history: [],
  },
]

// ===================== Small UI parts =====================
function StatusBadge({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'md' }) {
  const s = STATUS[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${s.chipBg} ${s.chipText} ${
        size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function Avatar({ name, className = '' }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((x) => x[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className={`grid place-items-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-800 ${className || 'size-8'}`}>
      {initials}
    </div>
  )
}

function FileIconTile({ kind, className = 'size-9 text-[10px]' }: { kind: Attachment['kind']; className?: string }) {
  const map: Record<string, string> = {
    PDF: 'bg-red-500',
    XLS: 'bg-emerald-600',
    DOC: 'bg-blue-600',
    IMG: 'bg-sky-500',
  }
  return <div className={`grid place-items-center rounded-lg font-bold text-white ${map[kind]} ${className}`}>{kind}</div>
}

// ===================== Top Bar =====================
function TopBar() {
  const navItems = [
    { label: 'Главная', active: false },
    { label: 'Досье', active: false },
    { label: 'Обращения', active: false },
    { label: 'Расследования', active: true },
    { label: 'Отчёты', active: false },
  ]
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-8 py-3.5">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <ShieldCheck className="size-5" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold text-slate-900">Compliance</div>
            <div className="text-[11px] text-slate-500">Система внутреннего контроля</div>
          </div>
        </div>
        <nav className="hidden gap-1 md:flex">
          {navItems.map((n) => (
            <button
              key={n.label}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                n.active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <Avatar name="Аида Касымова" className="size-9 text-xs" />
        </div>
      </div>
    </header>
  )
}

// ===================== Page Header =====================
function PageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span>Главная</span>
          <ChevronRight className="size-3" />
          <span className="font-medium text-slate-600">Расследования</span>
        </div>
        <h1 className="text-[28px] font-bold leading-tight text-slate-900">Расследования</h1>
        <p className="mt-1 text-sm text-slate-500">Управление внутренними расследованиями по обращениям и нарушениям</p>
      </div>
      <div className="flex gap-2.5">
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50">
          <Download className="size-4" />
          Выгрузить отчёт
        </button>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Создать
        </button>
      </div>
    </div>
  )
}

// ===================== Stats =====================
function Stats({ data }: { data: Investigation[] }) {
  const total = data.length
  const inProg = data.filter((d) => d.status === 'progress').length
  const done = data.filter((d) => d.status === 'completed' || d.status === 'signed').length
  const signed = data.filter((d) => d.status === 'signed').length
  const drafts = data.filter((d) => d.status === 'draft').length
  const items: { label: string; value: string; sub: string; tone: string; icon: React.ReactNode }[] = [
    { label: 'Всего расследований', value: String(total), sub: 'в системе', tone: 'text-slate-500', icon: <FileText className="size-4 text-slate-400" /> },
    { label: 'В работе', value: String(inProg), sub: 'требуют действий', tone: 'text-amber-600', icon: <Clock className="size-4 text-amber-500" /> },
    { label: 'Завершено', value: String(done), sub: `из них ${signed} подписаны`, tone: 'text-emerald-600', icon: <CheckCircle2 className="size-4 text-emerald-500" /> },
    { label: 'Черновики', value: String(drafts), sub: 'не начаты', tone: 'text-slate-500', icon: <PenLine className="size-4 text-slate-400" /> },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-medium text-slate-500">{i.label}</div>
            {i.icon}
          </div>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-[28px] font-bold leading-none text-slate-900">{i.value}</span>
            <span className={`text-[12px] font-medium ${i.tone}`}>{i.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ===================== Toolbar =====================
type Filters = {
  search: string
  status: Status | 'all'
  violation: string
  responsible: string
  signed: 'all' | 'yes' | 'no'
}

function Toolbar({
  filters,
  setFilters,
  view,
  setView,
}: {
  filters: Filters
  setFilters: (f: Filters) => void
  view: 'table' | 'cards'
  setView: (v: 'table' | 'cards') => void
}) {
  const statusOpts: { value: Status | 'all'; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'draft', label: 'Черновик' },
    { value: 'progress', label: 'В работе' },
    { value: 'completed', label: 'Завершено' },
    { value: 'signed', label: 'Подписано' },
  ]
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex w-[340px] max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="size-4 text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Поиск по номеру, цели или ответственному"
            className="flex-1 bg-transparent text-sm outline-hidden placeholder:text-slate-400"
          />
        </div>
        <FilterSelect
          label="Статус"
          value={filters.status}
          options={statusOpts as { value: string; label: string }[]}
          onChange={(v) => setFilters({ ...filters, status: v as Status | 'all' })}
        />
        <FilterSelect
          label="Тип нарушения"
          value={filters.violation}
          options={[{ value: 'all', label: 'Любой' }, ...VIOLATION_TYPES.map((v) => ({ value: v, label: v }))]}
          onChange={(v) => setFilters({ ...filters, violation: v })}
        />
        <FilterSelect
          label="Ответственный"
          value={filters.responsible}
          options={[
            { value: 'all', label: 'Все' },
            { value: 'А. Касымова', label: 'А. Касымова' },
            { value: 'Д. Ермеков', label: 'Д. Ермеков' },
            { value: 'М. Алиева', label: 'М. Алиева' },
            { value: 'Н. Турсунов', label: 'Н. Турсунов' },
            { value: 'С. Жумабаев', label: 'С. Жумабаев' },
          ]}
          onChange={(v) => setFilters({ ...filters, responsible: v })}
        />
        <FilterSelect
          label="Подписан"
          value={filters.signed}
          options={[
            { value: 'all', label: 'Все' },
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
          ]}
          onChange={(v) => setFilters({ ...filters, signed: v as Filters['signed'] })}
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
          <ArrowUpDown className="size-3.5" />
          Дата обновления
        </button>
        <div className="flex gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setView('table')}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${
              view === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Table2 className="size-3.5" />
            Таблица
          </button>
          <button
            onClick={() => setView('cards')}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${
              view === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            <LayoutGrid className="size-3.5" />
            Карточки
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.value === value)
  const isActive = value !== 'all'
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((x) => !x)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
          isActive
            ? 'border-blue-300 bg-blue-50 text-blue-700'
            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
        }`}
      >
        <span>{label}:</span>
        <span className={isActive ? 'text-blue-700' : 'text-slate-900'}>{current?.label}</span>
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-full z-20 mt-1.5 min-w-[200px] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50 ${
                  o.value === value ? 'font-semibold text-blue-700' : 'text-slate-700'
                }`}
              >
                {o.label}
                {o.value === value && <Check className="size-3.5" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ===================== Table =====================
function InvestigationsTable({ rows, onOpen }: { rows: Investigation[]; onOpen: (id: string) => void }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-16 text-center shadow-xs">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-slate-100">
          <Search className="size-5 text-slate-400" />
        </div>
        <div className="text-base font-semibold text-slate-900">Ничего не найдено</div>
        <div className="mt-1 text-sm text-slate-500">Попробуйте изменить параметры поиска или фильтры</div>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="grid grid-cols-[130px_1fr_180px_120px_160px_180px_140px_100px_40px] gap-0 border-b border-slate-200 bg-slate-50 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <div className="flex items-center gap-1.5">№ <ArrowUpDown className="size-3 text-slate-300" /></div>
        <div className="flex items-center gap-1.5">Цель расследования <ArrowUpDown className="size-3 text-slate-300" /></div>
        <div className="flex items-center gap-1.5">Тип нарушения</div>
        <div className="flex items-center gap-1.5">Дата события</div>
        <div className="flex items-center gap-1.5">Локация</div>
        <div className="flex items-center gap-1.5">Ответственный</div>
        <div className="flex items-center gap-1.5">Статус <ArrowUpDown className="size-3 text-slate-300" /></div>
        <div className="flex items-center gap-1.5">Связи</div>
        <div />
      </div>
      {rows.map((r, i) => (
        <button
          key={r.id}
          onClick={() => onOpen(r.id)}
          className={`grid w-full grid-cols-[130px_1fr_180px_120px_160px_180px_140px_100px_40px] items-center gap-0 border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-blue-50/50 ${
            i % 2 === 1 ? 'bg-slate-50/40' : ''
          }`}
        >
          <div className="min-w-0 pr-2">
            <div className="text-[13px] font-semibold text-slate-900">{r.number}</div>
            <div className="text-[11px] text-slate-400">создано {r.createdDate}</div>
          </div>
          <div className="min-w-0 pr-3">
            <div className="line-clamp-2 text-sm font-medium text-slate-900">{r.goal}</div>
          </div>
          <div>
            <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{r.violationType}</span>
          </div>
          <div className="text-[13px] text-slate-700">{r.eventDate}</div>
          <div className="flex min-w-0 items-center gap-1.5 text-[13px] text-slate-700">
            <MapPin className="size-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{r.location}</span>
          </div>
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar name={r.responsible.name} className="size-7 text-[11px]" />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium text-slate-900">{r.responsible.name}</div>
              <div className="text-[11px] text-slate-400">{r.responsible.role}</div>
            </div>
          </div>
          <div>
            <StatusBadge status={r.status} />
          </div>
          <div>
            <div className="text-[13px] font-medium text-slate-900">
              {r.persons.length} / {r.complaints.length}
            </div>
            <div className="text-[10px] text-slate-400">лиц / обращ.</div>
          </div>
          <div className="flex justify-end">
            <span className="grid size-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <MoreHorizontal className="size-4" />
            </span>
          </div>
        </button>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3.5">
        <div className="text-[12px] text-slate-500">Показано 1–{rows.length} из {rows.length} расследований</div>
        <div className="flex gap-1.5">
          {['←', '1', '2', '3', '…', '17', '→'].map((l) => (
            <button
              key={l}
              className={`min-w-[28px] rounded-md border px-2.5 py-1 text-xs font-medium ${
                l === '1'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===================== Generic Modal =====================
function Modal({ children, widthClass = 'w-[1180px]' }: { children: React.ReactNode; onClose: () => void; widthClass?: string }) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/55 backdrop-blur-sm">
      <div className="min-h-full px-4 py-10 sm:px-6">
        <div className={`mx-auto ${widthClass} max-w-full rounded-2xl bg-white shadow-2xl`}>
          <div role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===================== Small shared =====================
function Section({ num, title, desc, children }: { num: number; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <div className="grid size-7 place-items-center rounded-full bg-blue-50 text-[13px] font-semibold text-blue-700">{num}</div>
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
          {desc && <p className="text-[12px] text-slate-500">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {error && (
        <span className="inline-flex items-center gap-1 text-[12px] text-red-600">
          <AlertTriangle className="size-3" />
          {error}
        </span>
      )}
    </label>
  )
}

function FileRow({ file, onRemove }: { file: Attachment; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <FileIconTile kind={file.kind} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-slate-900">{file.name}</div>
        <div className="text-[11px] text-slate-400">{file.size}</div>
      </div>
      <button className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-700 hover:underline">
        <Download className="size-3.5" />
        Скачать
      </button>
      {onRemove && (
        <button onClick={onRemove} className="text-slate-400 hover:text-red-600">
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  )
}

function PersonRow({ person, onRemove }: { person: Person; onRemove?: () => void }) {
  const linked = person.type === 'employee'
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`grid size-10 place-items-center rounded-full text-[13px] font-semibold ${linked ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'}`}>
          {person.fullName
            .split(' ')
            .map((x) => x[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-slate-900">{person.fullName}</span>
            {linked ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                <Link2 className="size-3" />
                Из Досье
              </span>
            ) : (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">Внешнее лицо</span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-2 text-[12px] text-slate-500">
            <span>{person.type === 'employee' ? 'ИИН' : 'ИИН/БИН'}: {person.iinBin}</span>
            {person.role && (<><span className="text-slate-300">·</span><span>{person.role}</span></>)}
            {person.department && (<><span className="text-slate-300">·</span><span>{person.department}</span></>)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {linked && (
          <a className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-700 hover:underline">
            Открыть досье
            <ExternalLink className="size-3" />
          </a>
        )}
        {onRemove && (
          <button onClick={onRemove} className="text-slate-400 hover:text-red-600">
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function ComplaintRow({ complaint, onRemove }: { complaint: Complaint; onRemove?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold text-blue-700">{complaint.number}</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{complaint.channel}</span>
          <span className="text-[11px] text-slate-500">{complaint.date}</span>
        </div>
        <div className="mt-1 truncate text-[13px] font-medium text-slate-900">{complaint.topic}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="text-slate-400">Ответственный (авт.):</span>
          <span className="font-medium text-slate-700">{complaint.responsible}</span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Lock className="size-3" />
            заполнено автоматически
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-700 hover:underline">
          Открыть
          <ExternalLink className="size-3" />
        </a>
        {onRemove && (
          <button onClick={onRemove} className="text-slate-400 hover:text-red-600">
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ===================== Create Modal =====================
function CreateModal({ onClose, onCreate }: { onClose: () => void; onCreate: (i: Investigation) => void }) {
  const [goal, setGoal] = useState('')
  const [violationType, setViolationType] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<Attachment[]>([])
  const [persons, setPersons] = useState<Person[]>([])
  const [personMode, setPersonMode] = useState<'employee' | 'external'>('employee')
  const [extIin, setExtIin] = useState('')
  const [extName, setExtName] = useState('')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [showErrors, setShowErrors] = useState(false)

  const errors = {
    goal: !goal.trim(),
    violationType: !violationType,
    eventDate: !eventDate,
    description: !description.trim(),
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const handleSubmit = () => {
    if (hasErrors) {
      setShowErrors(true)
      return
    }
    const id = 'inv-new-' + Date.now()
    onCreate({
      id,
      number: `INV-2026-0${Math.floor(Math.random() * 900 + 100)}`,
      goal,
      violationType,
      eventDate,
      location,
      description,
      responsible: { name: 'А. Касымова', role: 'Compliance' },
      status: 'draft',
      createdDate: new Date().toLocaleDateString('ru'),
      updatedAt: 'только что',
      persons,
      complaints,
      attachments: files,
      notes: [],
      history: [{ when: new Date().toLocaleString('ru'), who: 'А. Касымова', action: 'Черновик создан' }],
    })
    onClose()
  }

  const addExternal = () => {
    if (!extIin.trim() || !extName.trim()) return
    setPersons((p) => [...p, { id: 'p-' + Date.now(), type: 'external', fullName: extName.trim(), iinBin: extIin.trim() }])
    setExtIin('')
    setExtName('')
  }

  return (
    <Modal onClose={onClose} widthClass="w-[920px]">
      <div className="flex items-start justify-between gap-6 border-b border-slate-100 px-8 pb-5 pt-6">
        <div>
          <h2 className="text-[22px] font-bold text-slate-900">Создать расследование</h2>
          <p className="mt-1 text-[13px] text-slate-500">Заполните основные данные. Поля со * обязательны.</p>
        </div>
        <button onClick={onClose} className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-6 px-8 py-6">
        {/* Section 1 — Main info */}
        <Section num={1} title="Основная информация" desc="Цель, вид и обстоятельства нарушения">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <Field label="Цель расследования" required error={showErrors && errors.goal ? 'Укажите цель' : undefined}>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Напр.: Утечка персональных данных клиентов"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Вид нарушения" required error={showErrors && errors.violationType ? 'Выберите вид' : undefined}>
                <div className="relative">
                  <select
                    value={violationType}
                    onChange={(e) => setViolationType(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  >
                    <option value="">Выберите…</option>
                    {VIOLATION_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              </Field>
              <Field label="Дата события" required error={showErrors && errors.eventDate ? 'Укажите дату' : undefined}>
                <div className="relative">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  />
                </div>
              </Field>
            </div>
            <Field label="Место нарушения">
              <div className="relative">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Напр.: Алматы, головной офис"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pl-9 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                />
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>
            <Field label="Описание нарушения" required error={showErrors && errors.description ? 'Добавьте описание' : undefined}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Опишите обстоятельства, известные факты и предварительные данные…"
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
              />
            </Field>
            <div className="space-y-2.5">
              <div className="text-[12px] font-medium text-slate-600">Вложения</div>
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                <Upload className="size-6 text-blue-600" />
                <div className="text-sm font-medium text-slate-800">Перетащите файлы сюда или нажмите для выбора</div>
                <div className="text-xs text-slate-400">PDF, DOCX, XLSX, JPG, PNG — до 25 МБ</div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const list = Array.from(e.target.files || []).map<Attachment>((f) => ({
                      id: 'a-' + Math.random(),
                      name: f.name,
                      size: `${Math.max(1, Math.round(f.size / 1024))} КБ`,
                      kind: /\.pdf$/i.test(f.name) ? 'PDF' : /\.(xls|xlsx)$/i.test(f.name) ? 'XLS' : /\.(docx?|rtf)$/i.test(f.name) ? 'DOC' : 'IMG',
                    }))
                    setFiles((p) => [...p, ...list])
                  }}
                />
              </label>
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f) => (
                    <FileRow key={f.id} file={f} onRemove={() => setFiles((p) => p.filter((x) => x.id !== f.id))} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Section 2 — Related persons */}
        <Section num={2} title="Связанные лица" desc="Сотрудники из Досье или внешние лица / организации">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setPersonMode('employee')}
                className={`inline-flex min-w-[160px] items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold ${
                  personMode === 'employee' ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200' : 'text-slate-500'
                }`}
              >
                <User className="size-4" />
                Из Досье
              </button>
              <button
                onClick={() => setPersonMode('external')}
                className={`inline-flex min-w-[160px] items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold ${
                  personMode === 'external' ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200' : 'text-slate-500'
                }`}
              >
                <Building2 className="size-4" />
                Внешнее лицо
              </button>
            </div>

            {personMode === 'employee' ? (
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <Search className="size-4 text-slate-400" />
                <input placeholder="Поиск сотрудника по ИИН или ФИО в Досье" className="flex-1 bg-transparent text-sm outline-hidden placeholder:text-slate-400" />
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
                <input value={extIin} onChange={(e) => setExtIin(e.target.value)} placeholder="ИИН / БИН" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10" />
                <input value={extName} onChange={(e) => setExtName(e.target.value)} placeholder="ФИО / Наименование" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10" />
                <button onClick={addExternal} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                  <Plus className="size-4" />
                  Добавить
                </button>
              </div>
            )}

            <div className="space-y-2.5">
              {persons.map((p) => (
                <PersonRow key={p.id} person={p} onRemove={() => setPersons((x) => x.filter((i) => i.id !== p.id))} />
              ))}
              {persons.length === 0 && <p className="text-center text-[13px] text-slate-400">Пока нет добавленных лиц</p>}
            </div>

            {personMode === 'employee' && (
              <div className="space-y-2">
                <div className="text-[12px] font-medium text-slate-500">Быстрый выбор из Досье</div>
                <div className="grid gap-2">
                  {[
                    { id: 'e1', fullName: 'Иванов Сергей Петрович', iinBin: '880512300456', role: 'Менеджер CRM', department: 'Отдел продаж' },
                    { id: 'e2', fullName: 'Сулейменова Айгуль Маратовна', iinBin: '910823400789', role: 'Администратор БД', department: 'ИТ' },
                  ].map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setPersons((p) => (p.find((x) => x.id === e.id) ? p : [...p, { ...e, type: 'employee' as const }]))}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={e.fullName} className="size-9 text-[11px]" />
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900">{e.fullName}</div>
                          <div className="text-[11px] text-slate-500">
                            ИИН {e.iinBin} · {e.role} · {e.department}
                          </div>
                        </div>
                      </div>
                      <Plus className="size-4 text-blue-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Section 3 — complaints */}
        <Section num={3} title="Связанные обращения" desc="Обращения с горячей линии, на основании которых открыто расследование">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search className="size-4 text-slate-400" />
              <input placeholder="Найти обращение по номеру или ключевым словам" className="flex-1 bg-transparent text-sm outline-hidden placeholder:text-slate-400" />
            </div>
            <div className="space-y-2.5">
              {complaints.map((c) => (
                <ComplaintRow key={c.id} complaint={c} onRemove={() => setComplaints((p) => p.filter((x) => x.id !== c.id))} />
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-slate-500">Быстрый выбор</div>
              {[
                { id: 'hl1', number: 'HL-2026-00921', topic: 'Сообщение о возможной утечке клиентской базы из CRM', responsible: 'А. Касымова', date: '08.04.2026', channel: 'Горячая линия' },
                { id: 'hl2', number: 'HL-2026-00917', topic: 'Жалоба сотрудника на нарушение политики обработки ПДн', responsible: 'А. Касымова', date: '05.04.2026', channel: 'Email' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setComplaints((p) => (p.find((x) => x.id === c.id) ? p : [...p, c]))}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-blue-700">{c.number}</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{c.channel}</span>
                      <span className="text-[11px] text-slate-500">{c.date}</span>
                    </div>
                    <div className="mt-1 truncate text-[13px] text-slate-800">{c.topic}</div>
                  </div>
                  <Plus className="size-4 shrink-0 text-blue-600" />
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Responsible auto */}
        <Section num={4} title="Ответственный" desc="Заполняется автоматически на основании профиля создающего">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Avatar name="Аида Касымова" className="size-10 text-xs" />
              <div>
                <div className="text-[14px] font-semibold text-slate-900">А. Касымова</div>
                <div className="text-[12px] text-slate-500">Compliance · 22726@company.kz</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
              <Lock className="size-3" />
              Заполнено автоматически
            </span>
          </div>
        </Section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 px-8 py-4">
        <div className="inline-flex items-center gap-2 text-[12px] text-slate-500">
          <Info className="size-3.5" />
          Черновик автосохраняется каждые 30 секунд
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Отмена
          </button>
          <button className="rounded-lg bg-blue-50 px-3.5 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100">Сохранить как черновик</button>
          <button onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Plus className="size-4" />
            Создать
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ===================== Card Modal =====================
type Tab = 'general' | 'persons' | 'complaints' | 'result'

function SubCard({ title, count, action, locked, children }: { title: string; count?: number; action?: React.ReactNode; locked?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
          {count !== undefined && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{count}</span>
          )}
          {locked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              <Lock className="size-3" />
              Заблокировано
            </span>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function Kv({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-[14px] font-medium leading-snug text-slate-900">{children}</div>
    </div>
  )
}

function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="whitespace-pre-line rounded-lg bg-slate-50 p-4 text-[14px] leading-relaxed text-slate-800">{value}</div>
    </div>
  )
}

function TabGeneral({ inv, isLocked, onUpdate }: { inv: Investigation; isLocked: boolean; onUpdate: (patch: Partial<Investigation>) => void }) {
  const [editing, setEditing] = useState(false)
  return (
    <>
      <SubCard
        title="Общая информация"
        locked={isLocked}
        action={
          !isLocked && (
            <button
              onClick={() => setEditing((x) => !x)}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-200"
            >
              <PenLine className="size-3.5" />
              {editing ? 'Готово' : 'Редактировать'}
            </button>
          )
        }
      >
        <div className="grid gap-5 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <Kv label="Цель расследования">
            {editing ? (
              <input defaultValue={inv.goal} onBlur={(e) => onUpdate({ goal: e.target.value })} className="w-full rounded-md border border-slate-200 px-2 py-1 text-[13px] outline-hidden focus:border-blue-500" />
            ) : (
              inv.goal
            )}
          </Kv>
          <Kv label="Вид нарушения">
            <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-medium text-slate-700">{inv.violationType}</span>
          </Kv>
          <Kv label="Дата события">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400" />
              {inv.eventDate}
            </span>
          </Kv>
          <Kv label="Место нарушения">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-slate-400" />
              {editing ? (
                <input defaultValue={inv.location} onBlur={(e) => onUpdate({ location: e.target.value })} className="w-full rounded-md border border-slate-200 px-2 py-1 text-[13px] outline-hidden focus:border-blue-500" />
              ) : (
                inv.location
              )}
            </span>
          </Kv>
          <Kv label="Ответственный" full>
            <div className="flex items-center gap-2.5">
              <Avatar name={inv.responsible.name} className="size-8 text-[11px]" />
              <div>
                <div className="text-[13px] font-semibold text-slate-900">{inv.responsible.name}</div>
                <div className="text-[11px] text-slate-500">{inv.responsible.role}</div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                <Lock className="size-3" />
                Только создатель
              </span>
            </div>
          </Kv>
        </div>
      </SubCard>

      <SubCard title="Описание">
        {editing && !isLocked ? (
          <textarea
            defaultValue={inv.description}
            onBlur={(e) => onUpdate({ description: e.target.value })}
            rows={5}
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
          />
        ) : (
          <p className="whitespace-pre-line text-[14px] leading-relaxed text-slate-700">{inv.description}</p>
        )}
      </SubCard>

      <SubCard
        title="Вложения"
        count={inv.attachments.length}
        action={
          !isLocked && (
            <button className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-[12px] font-medium text-blue-700 hover:bg-blue-100">
              <Upload className="size-3.5" />
              Добавить файл
            </button>
          )
        }
      >
        {inv.attachments.length > 0 ? (
          <div className="space-y-2">
            {inv.attachments.map((a) => (
              <FileRow key={a.id} file={a} />
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-slate-400">Нет прикреплённых файлов</p>
        )}
      </SubCard>
    </>
  )
}

function TabPersons({ inv, isLocked, onUpdate }: { inv: Investigation; isLocked: boolean; onUpdate: (p: Partial<Investigation>) => void }) {
  return (
    <SubCard
      title="Связанные лица"
      count={inv.persons.length}
      locked={isLocked}
      action={
        !isLocked && (
          <button className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-[12px] font-medium text-blue-700 hover:bg-blue-100">
            <Plus className="size-3.5" />
            Добавить лицо
          </button>
        )
      }
    >
      {inv.persons.length > 0 ? (
        <div className="space-y-2.5">
          {inv.persons.map((p) => (
            <PersonRow
              key={p.id}
              person={p}
              onRemove={!isLocked ? () => onUpdate({ persons: inv.persons.filter((x) => x.id !== p.id) }) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center gap-1 rounded-lg bg-slate-50 px-4 py-10 text-center">
          <Users className="size-8 text-slate-300" />
          <div className="mt-1 text-[14px] font-semibold text-slate-700">Пока нет связанных лиц</div>
          <div className="text-[12px] text-slate-500">Добавьте сотрудников из Досье или внешних лиц / организаций</div>
        </div>
      )}
    </SubCard>
  )
}

function TabComplaints({ inv, isLocked, onUpdate }: { inv: Investigation; isLocked: boolean; onUpdate: (p: Partial<Investigation>) => void }) {
  return (
    <SubCard
      title="Связанные обращения"
      count={inv.complaints.length}
      locked={isLocked}
      action={
        !isLocked && (
          <button className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-[12px] font-medium text-blue-700 hover:bg-blue-100">
            <Plus className="size-3.5" />
            Привязать обращение
          </button>
        )
      }
    >
      {inv.complaints.length > 0 ? (
        <div className="space-y-2.5">
          {inv.complaints.map((c) => (
            <ComplaintRow
              key={c.id}
              complaint={c}
              onRemove={!isLocked ? () => onUpdate({ complaints: inv.complaints.filter((x) => x.id !== c.id) }) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center gap-1 rounded-lg bg-slate-50 px-4 py-10 text-center">
          <MessageSquare className="size-8 text-slate-300" />
          <div className="mt-1 text-[14px] font-semibold text-slate-700">Нет связанных обращений</div>
          <div className="text-[12px] text-slate-500">Выберите обращение из списка горячей линии</div>
        </div>
      )}
    </SubCard>
  )
}

function TabResult({ inv, isLocked, onUpdate }: { inv: Investigation; isLocked: boolean; onUpdate: (p: Partial<Investigation>) => void }) {
  const editable = !isLocked
  return (
    <>
      <SubCard title="Результат расследования" locked={isLocked}>
        <div className="space-y-4 border-t border-slate-100 pt-4">
          {editable ? (
            <Field label="Установленный факт нарушения" required>
              <textarea
                defaultValue={inv.result || ''}
                onBlur={(e) => onUpdate({ result: e.target.value })}
                rows={5}
                placeholder="Опишите установленный факт — что именно произошло, кто причастен, какой ущерб…"
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
              />
            </Field>
          ) : (
            <LockedField label="Установленный факт нарушения" value={inv.result || '—'} />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Заключение">
              {editable ? (
                <div className="relative">
                  <select
                    defaultValue={inv.verdict || ''}
                    onChange={(e) => onUpdate({ verdict: (e.target.value as 'confirmed' | 'rejected') || undefined })}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  >
                    <option value="">Выберите…</option>
                    <option value="confirmed">Нарушение подтверждено</option>
                    <option value="rejected">Не подтверждено</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              ) : (
                <div>
                  {inv.verdict === 'confirmed' ? (
                    <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">
                      <AlertTriangle className="size-4" />
                      Нарушение подтверждено
                    </span>
                  ) : inv.verdict === 'rejected' ? (
                    <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-[13px] font-semibold text-emerald-700">
                      <CheckCircle2 className="size-4" />
                      Не подтверждено
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
              )}
            </Field>
            <Field label="Степень тяжести">
              {editable ? (
                <div className="relative">
                  <select
                    defaultValue={inv.severity || ''}
                    onChange={(e) => onUpdate({ severity: (e.target.value as 'low' | 'mid' | 'high') || undefined })}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  >
                    <option value="">Выберите…</option>
                    <option value="low">Низкая</option>
                    <option value="mid">Средняя</option>
                    <option value="high">Высокая</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              ) : (
                <div>
                  {inv.severity === 'high' && <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-700"><Circle className="size-2.5 fill-current" />Высокая</span>}
                  {inv.severity === 'mid' && <span className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3.5 py-2.5 text-[13px] font-semibold text-amber-700"><Circle className="size-2.5 fill-current" />Средняя</span>}
                  {inv.severity === 'low' && <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3.5 py-2.5 text-[13px] font-semibold text-slate-600"><Circle className="size-2.5 fill-current" />Низкая</span>}
                  {!inv.severity && <span className="text-slate-400">—</span>}
                </div>
              )}
            </Field>
          </div>
        </div>
      </SubCard>

      <SubCard title="Рекомендации и корректирующие меры" locked={isLocked}>
        {editable ? (
          <textarea
            defaultValue={inv.recommendations || ''}
            onBlur={(e) => onUpdate({ recommendations: e.target.value })}
            rows={6}
            placeholder={`1. Перечислите корректирующие меры…\n2. Укажите сроки исполнения…\n3. Назначьте ответственных…`}
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
          />
        ) : (
          <div className="whitespace-pre-line rounded-lg bg-slate-50 p-4 text-[14px] leading-relaxed text-slate-800">
            {inv.recommendations || '—'}
          </div>
        )}
      </SubCard>

      {(inv.status === 'completed' || inv.status === 'signed') && (
        <SubCard
          title="Итоговый отчёт"
          action={
            inv.status === 'signed' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                <BadgeCheck className="size-3.5" />
                Подписан ЭЦП
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                <Clock className="size-3.5" />
                Ожидает подписи
              </span>
            )
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-14 w-12 place-items-center rounded-lg bg-red-500 text-[11px] font-bold text-white">PDF</div>
              <div>
                <div className="text-[14px] font-semibold text-slate-900">Отчёт_{inv.number}{inv.status === 'signed' ? '_подписан' : ''}.pdf</div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span>3.4 МБ</span>
                  <span>·</span>
                  <span>12 страниц</span>
                  {inv.signedAt && (
                    <>
                      <span>·</span>
                      <span>Подписан {inv.signedAt}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">
                <Eye className="size-4" />
                Просмотр
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[13px] font-medium text-white hover:bg-blue-700">
                {inv.status === 'signed' ? <QrCode className="size-4" /> : <Download className="size-4" />}
                Скачать {inv.status === 'signed' && <span className="text-[10px] opacity-80">с QR</span>}
              </button>
            </div>
          </div>
        </SubCard>
      )}
    </>
  )
}

// ===================== Detail Page (full-page view) =====================
function PrimaryAction({
  inv,
  onStart,
  onComplete,
  onSign,
  canComplete,
}: {
  inv: Investigation
  onStart: () => void
  onComplete: () => void
  onSign: () => void
  canComplete: boolean
}) {
  if (inv.status === 'draft')
    return (
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        <Play className="size-4" />
        Начать расследование
      </button>
    )
  if (inv.status === 'progress')
    return (
      <button
        disabled={!canComplete}
        onClick={onComplete}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        title={canComplete ? '' : 'Заполните «Результат» и «Рекомендации»'}
      >
        <CheckCircle2 className="size-4" />
        Завершить расследование
      </button>
    )
  if (inv.status === 'completed')
    return (
      <button
        onClick={onSign}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
      >
        <FileSignature className="size-4" />
        Подписать с ЭЦП
      </button>
    )
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <Lock className="size-3.5" />
      Карточка заблокирована
    </span>
  )
}

function DetailPage({
  inv,
  onBack,
  onStart,
  onComplete,
  onSign,
  onOpenNotes,
  onUpdate,
}: {
  inv: Investigation
  onBack: () => void
  onStart: () => void
  onComplete: () => void
  onSign: () => void
  onOpenNotes: () => void
  onUpdate: (patch: Partial<Investigation>) => void
}) {
  const [tab, setTab] = useState<Tab>('general')
  const isLocked = inv.status === 'completed' || inv.status === 'signed'
  const isSigned = inv.status === 'signed'
  const canComplete =
    inv.status === 'progress' && (inv.result || '').trim().length > 0 && (inv.recommendations || '').trim().length > 0

  const order: Status[] = ['draft', 'progress', 'completed', 'signed']
  const curIx = order.indexOf(inv.status)

  const stats = [
    { icon: Users, label: 'Связанных лиц', value: inv.persons.length },
    { icon: MessageSquare, label: 'Обращений', value: inv.complaints.length },
    { icon: Paperclip, label: 'Вложений', value: inv.attachments.length },
    { icon: StickyNote, label: 'Заметок', value: inv.notes.length },
  ]

  return (
    <>
      {/* Sub-header: back, crumbs, right actions */}
      <div className="sticky top-[65px] z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-8 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="size-4" />
              Назад
            </button>
            <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-slate-400">
              <span>Главная</span>
              <ChevronRight className="size-3" />
              <button onClick={onBack} className="hover:text-blue-700">Расследования</button>
              <ChevronRight className="size-3" />
              <span className="truncate font-semibold text-slate-700">{inv.number}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNotes}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <StickyNote className="size-4" />
              Заметки
              {inv.notes.length > 0 && (
                <span className="rounded-full bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-600">{inv.notes.length}</span>
              )}
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {isSigned ? <QrCode className="size-4" /> : <Download className="size-4" />}
              Скачать отчёт
              {isSigned && <span className="text-[11px] text-slate-400">(с QR)</span>}
            </button>
            <PrimaryAction inv={inv} onStart={onStart} onComplete={onComplete} onSign={onSign} canComplete={canComplete} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] space-y-6 px-8 py-6">
        {/* Banner */}
        {isSigned && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-50/40 p-4">
            <div className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white shadow-sm">
              <BadgeCheck className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-emerald-900">Расследование завершено и подписано ЭЦП</div>
              <div className="mt-0.5 text-[12px] text-emerald-800/80">
                Подписано: {inv.signedBy} · {inv.signedAt} · Сертификат №{inv.signature?.cert}
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-emerald-800 ring-1 ring-emerald-300 hover:bg-emerald-100">
              <QrCode className="size-4" />
              Скачать с QR
            </button>
          </div>
        )}
        {inv.status === 'completed' && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/40 p-4">
            <div className="grid size-10 place-items-center rounded-full bg-amber-500 text-white shadow-sm">
              <FileSignature className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-amber-900">Расследование завершено. Ожидается подпись ЭЦП</div>
              <div className="mt-0.5 text-[12px] text-amber-800/80">Нажмите «Подписать с ЭЦП», чтобы сформировать итоговый отчёт и отправить на ЭДО API.</div>
            </div>
          </div>
        )}

        {/* Hero */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="relative border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/90 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-white">
                    {inv.number}
                  </span>
                  <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">{inv.violationType}</span>
                  <StatusBadge status={inv.status} size="md" />
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                      <Lock className="size-3" />
                      Только чтение
                    </span>
                  )}
                </div>
                <h1 className="text-[30px] font-bold leading-tight tracking-tight text-slate-900">{inv.goal}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4 text-slate-400" />
                    Событие: <b className="font-semibold text-slate-900">{inv.eventDate}</b>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 text-slate-400" />
                    {inv.location || '—'}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4 text-slate-400" />
                    Обновлено {inv.updatedAt}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <Avatar name={inv.responsible.name} className="size-11 text-sm" />
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Ответственный</div>
                  <div className="text-[14px] font-semibold text-slate-900">{inv.responsible.name}</div>
                  <div className="text-[12px] text-slate-500">{inv.responsible.role}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal stepper */}
          <div className="grid grid-cols-4 border-b border-slate-100 bg-white">
            {(
              [
                { key: 'draft', label: 'Черновик', sub: 'создание' },
                { key: 'progress', label: 'В работе', sub: 'расследование' },
                { key: 'completed', label: 'Завершено', sub: 'результат заполнен' },
                { key: 'signed', label: 'Подписано ЭЦП', sub: 'отчёт в ЭДО' },
              ] as { key: Status; label: string; sub: string }[]
            ).map((step, i) => {
              const stIx = order.indexOf(step.key)
              const state = stIx < curIx ? 'done' : stIx === curIx ? 'active' : 'pending'
              return (
                <div key={step.key} className={`relative flex items-center gap-3 px-6 py-4 ${state === 'active' ? 'bg-blue-50/60' : ''}`}>
                  <div
                    className={`grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      state === 'done'
                        ? 'bg-emerald-500 text-white'
                        : state === 'active'
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'border border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {state === 'done' ? <Check className="size-4" /> : i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-[13px] font-semibold ${state === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{step.label}</div>
                    <div className="text-[11px] text-slate-400">
                      {state === 'active' ? 'текущий этап' : state === 'done' ? 'пройден' : step.sub}
                    </div>
                  </div>
                  {i < 3 && (
                    <div className={`absolute right-0 top-1/2 h-0.5 w-4 -translate-y-1/2 ${state === 'done' ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 border-b border-slate-100 sm:grid-cols-4">
            {stats.map((s, i) => {
              const Ic = s.icon
              return (
                <div key={s.label} className={`flex items-center gap-3 px-6 py-4 ${i > 0 ? 'border-l border-slate-100' : ''}`}>
                  <div className="grid size-9 place-items-center rounded-lg bg-slate-50 text-slate-500">
                    <Ic className="size-4" />
                  </div>
                  <div>
                    <div className="text-[20px] font-bold leading-none text-slate-900">{s.value}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{s.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 overflow-x-auto px-8">
            {([
              { key: 'general', label: 'Общая информация', icon: FileText, count: undefined },
              { key: 'persons', label: 'Связанные лица', icon: Users, count: inv.persons.length },
              { key: 'complaints', label: 'Связанные обращения', icon: MessageSquare, count: inv.complaints.length },
              { key: 'result', label: 'Результат расследования', icon: CheckCircle2, count: undefined },
            ] as { key: Tab; label: string; icon: typeof FileText; count?: number }[]).map((t) => {
              const Ic = t.icon
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-4 text-sm font-medium transition ${
                    tab === t.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Ic className="size-4" />
                  {t.label}
                  {t.count !== undefined && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${tab === t.key ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Content grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            {tab === 'general' && <TabGeneral inv={inv} isLocked={isLocked} onUpdate={onUpdate} />}
            {tab === 'persons' && <TabPersons inv={inv} isLocked={isLocked} onUpdate={onUpdate} />}
            {tab === 'complaints' && <TabComplaints inv={inv} isLocked={isLocked} onUpdate={onUpdate} />}
            {tab === 'result' && <TabResult inv={inv} isLocked={isLocked} onUpdate={onUpdate} />}
          </div>

          <aside className="space-y-5">
            {/* Action / status helper card */}
            {inv.status === 'progress' && !canComplete && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <div>
                    <div className="text-[13px] font-semibold text-amber-900">Требуется завершить заполнение</div>
                    <p className="mt-1 text-[12px] leading-relaxed text-amber-800/80">
                      Чтобы завершить расследование, заполните «Результат» и «Рекомендации» на вкладке <b>«Результат расследования»</b>.
                    </p>
                    <button
                      onClick={() => setTab('result')}
                      className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-amber-900 hover:underline"
                    >
                      Перейти к результату
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isSigned && inv.signature && (
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h4 className="flex items-center gap-2 text-[14px] font-semibold text-slate-900">
                  <FileSignature className="size-4 text-indigo-600" />
                  Электронная подпись
                </h4>
                <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-10 place-items-center rounded-full bg-indigo-600 text-white shadow-sm">
                      <BadgeCheck className="size-5" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-indigo-900">Подписано НУЦ РК</div>
                      <div className="text-[11px] text-indigo-700">Действителен до {inv.signature.validUntil}</div>
                    </div>
                  </div>
                  <dl className="mt-3 space-y-1.5 text-[11px]">
                    {[
                      ['Сертификат', inv.signature.cert],
                      ['Подписант', inv.signedBy || ''],
                      ['Дата подписания', inv.signedAt || ''],
                      ['Хеш SHA-256', inv.signature.hash],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3">
                        <dt className="text-slate-500">{k}</dt>
                        <dd className="text-right font-medium text-slate-900">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {inv.attachments.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-[14px] font-semibold text-slate-900">
                    <Paperclip className="size-4 text-slate-400" />
                    Вложения
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {inv.attachments.length}
                    </span>
                  </h4>
                  {!isLocked && (
                    <button className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-700 hover:underline">
                      <Plus className="size-3.5" />
                      Загрузить
                    </button>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  {inv.attachments.map((a) => (
                    <div key={a.id} className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5">
                      <FileIconTile kind={a.kind} className="size-7 text-[9px]" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium text-slate-900">{a.name}</div>
                        <div className="text-[10px] text-slate-400">{a.size}</div>
                      </div>
                      <button className="text-slate-400 hover:text-blue-700">
                        <Download className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="flex items-center gap-2 text-[14px] font-semibold text-slate-900">
                <History className="size-4 text-slate-400" />
                История изменений
              </h4>
              <ol className="mt-3">
                {inv.history.map((h, i) => {
                  const isLast = i === inv.history.length - 1
                  return (
                    <li key={i} className="flex gap-3">
                      <div className="flex flex-col items-center pt-1">
                        <div className="size-2.5 rounded-full bg-blue-600" />
                        {!isLast && <div className="mt-1 w-0.5 flex-1 bg-slate-200" />}
                      </div>
                      <div className="pb-3.5">
                        <div className="text-[11px] text-slate-400">{h.when}</div>
                        <div className="text-[13px] font-medium text-slate-900">{h.action}</div>
                        <div className="text-[11px] text-slate-500">{h.who}</div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}


// ===================== Notes Drawer =====================
function NotesDrawer({ inv, onClose, onAdd }: { inv: Investigation; onClose: () => void; onAdd: (text: string) => void }) {
  const [text, setText] = useState('')
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm">
      <button onClick={onClose} className="absolute inset-0 size-full cursor-default" aria-label="Закрыть" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <StickyNote className="size-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Заметки</h3>
              <p className="text-[11px] text-slate-500">Внутренние комментарии · {inv.number}</p>
            </div>
          </div>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="size-4" />
          </button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {inv.notes.length === 0 && (
            <div className="grid place-items-center py-10 text-center">
              <StickyNote className="size-8 text-slate-300" />
              <div className="mt-2 text-[14px] font-semibold text-slate-700">Пока нет заметок</div>
              <div className="text-[12px] text-slate-500">Фиксируйте ход расследования — заметки видны только команде</div>
            </div>
          )}
          {inv.notes.map((n) => (
            <div key={n.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={n.author} className="size-7 text-[10px]" />
                  <span className="text-[12px] font-semibold text-slate-900">{n.author}</span>
                </div>
                <span className="text-[10px] text-slate-400">{n.when}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{n.body}</p>
            </div>
          ))}
        </div>
        <footer className="border-t border-slate-100 p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Новая заметка…"
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => {
                if (!text.trim()) return
                onAdd(text.trim())
                setText('')
              }}
              disabled={!text.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageSquare className="size-4" />
              Добавить заметку
            </button>
          </div>
        </footer>
      </aside>
    </div>
  )
}

// ===================== App =====================
export default function App() {
  const [investigations, setInvestigations] = useState<Investigation[]>(SAMPLE)
  const [filters, setFilters] = useState<Filters>({ search: '', status: 'all', violation: 'all', responsible: 'all', signed: 'all' })
  const [view, setView] = useState<'table' | 'cards'>('table')
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notesFor, setNotesFor] = useState<string | null>(null)

  const selected = investigations.find((i) => i.id === selectedId) || null
  const notesInv = investigations.find((i) => i.id === notesFor) || null

  const filtered = useMemo(() => {
    return investigations.filter((i) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!i.number.toLowerCase().includes(q) && !i.goal.toLowerCase().includes(q) && !i.responsible.name.toLowerCase().includes(q)) return false
      }
      if (filters.status !== 'all' && i.status !== filters.status) return false
      if (filters.violation !== 'all' && i.violationType !== filters.violation) return false
      if (filters.responsible !== 'all' && i.responsible.name !== filters.responsible) return false
      if (filters.signed === 'yes' && i.status !== 'signed') return false
      if (filters.signed === 'no' && i.status === 'signed') return false
      return true
    })
  }, [investigations, filters])

  const updateSelected = (patch: Partial<Investigation>) => {
    if (!selected) return
    setInvestigations((list) => list.map((i) => (i.id === selected.id ? { ...i, ...patch, updatedAt: 'только что' } : i)))
  }

  const handleStart = () => {
    if (!selected) return
    updateSelected({
      status: 'progress',
      history: [{ when: new Date().toLocaleString('ru'), who: selected.responsible.name, action: 'Расследование начато (Черновик → В работе)' }, ...selected.history],
    })
  }
  const handleComplete = () => {
    if (!selected) return
    updateSelected({
      status: 'completed',
      history: [{ when: new Date().toLocaleString('ru'), who: selected.responsible.name, action: 'Расследование завершено, заполнены результаты' }, ...selected.history],
    })
  }
  const handleSign = () => {
    if (!selected) return
    const now = new Date().toLocaleString('ru')
    updateSelected({
      status: 'signed',
      signedAt: now,
      signedBy: selected.responsible.name,
      signature: { cert: 'KZ-2026-NEW-' + Math.floor(Math.random() * 9000 + 1000), hash: '7c2a…b84d', validUntil: '2027' },
      history: [{ when: now, who: selected.responsible.name, action: 'Отчёт подписан ЭЦП' }, ...selected.history],
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <TopBar />
      {selected ? (
        <DetailPage
          inv={selected}
          onBack={() => setSelectedId(null)}
          onStart={handleStart}
          onComplete={handleComplete}
          onSign={handleSign}
          onOpenNotes={() => setNotesFor(selected.id)}
          onUpdate={updateSelected}
        />
      ) : (
      <main className="mx-auto max-w-[1440px] space-y-6 px-8 py-8">
        <PageHeader onCreate={() => setCreateOpen(true)} />
        <Stats data={investigations} />
        <Toolbar filters={filters} setFilters={setFilters} view={view} setView={setView} />
        {view === 'table' ? (
          <InvestigationsTable rows={filtered} onOpen={setSelectedId} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((i) => (
              <button
                key={i.id}
                onClick={() => setSelectedId(i.id)}
                className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-xs transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-blue-700">{i.number}</span>
                  <StatusBadge status={i.status} />
                </div>
                <div className="mt-3 line-clamp-2 text-[14px] font-semibold text-slate-900">{i.goal}</div>
                <div className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{i.violationType}</div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={i.responsible.name} className="size-7 text-[10px]" />
                    <div>
                      <div className="text-[12px] font-medium text-slate-900">{i.responsible.name}</div>
                      <div className="text-[10px] text-slate-400">{i.responsible.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">{i.eventDate}</div>
                    <div className="text-[10px] text-slate-400">{i.persons.length} лиц · {i.complaints.length} обр.</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div>
              <h3 className="text-[14px] font-semibold text-slate-900">Статусы расследования</h3>
              <p className="mt-1.5 text-[12px] text-slate-500">Используются единообразно в списке, шапке карточки и кнопках действий.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { s: 'draft' as Status, t: 'Создано, но работа ещё не начата. Все поля редактируемы.' },
                { s: 'progress' as Status, t: 'Расследование ведётся. Доступны действия и заметки.' },
                { s: 'completed' as Status, t: 'Заполнены результаты и рекомендации. Ожидает подписи ЭЦП.' },
                { s: 'signed' as Status, t: 'Подписано ЭЦП. Карточка переведена в режим только для чтения.' },
              ].map((l) => (
                <div key={l.s} className="space-y-1.5">
                  <StatusBadge status={l.s} />
                  <p className="text-[12px] leading-relaxed text-slate-600">{l.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      )}

      {createOpen && (
        <CreateModal
          onClose={() => setCreateOpen(false)}
          onCreate={(i) => setInvestigations((x) => [i, ...x])}
        />
      )}
      {notesInv && (
        <NotesDrawer
          inv={notesInv}
          onClose={() => setNotesFor(null)}
          onAdd={(body) =>
            setInvestigations((list) =>
              list.map((i) =>
                i.id === notesInv.id
                  ? {
                      ...i,
                      notes: [{ id: 'n-' + Date.now(), author: 'А. Касымова', when: 'только что', body }, ...i.notes],
                    }
                  : i
              )
            )
          }
        />
      )}
    </div>
  )
}
