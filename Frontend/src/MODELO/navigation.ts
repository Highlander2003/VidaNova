export type NavItem = {
  label: string;
  icon: string;
  count?: number;
  countLabel?: string;
  href: string;
};

export type WorkItem = {
  initials: string;
  name: string;
  record: string;
  age: string;
  service: string;
  priority: string;
  priorityTone: string;
  sla: string;
  slaTone: string;
  action: string;
  elapsed: string;
};

/** Ítems de la barra lateral usada por AppFrame en todas las páginas. */
export function buildSidebarNavItems(whatsappUnreadCount: number): NavItem[] {
  return [
    { label: "Centro de navegación", icon: "⌂", href: "/" },
    {
      label: "Conciliación",
      icon: "↔",
      count: 6,
      countLabel: "Historias clínicas pendientes de verificación humana",
      href: "/conciliacion",
    },
    { label: "Pacientes", icon: "◎", count: 124, href: "/pacientes" },
    { label: "Órdenes", icon: "▤", count: 27, href: "/ordenes" },
    { label: "Referencia", icon: "↗", count: 12, href: "/referencia" },
    {
      label: "CRM WhatsApp",
      icon: "◉",
      count: whatsappUnreadCount,
      href: "/whatsapp",
    },
    { label: "Indicadores", icon: "▥", href: "/indicadores" },
  ];
}

/** Ítems de la barra lateral propia de la portada ("/"). */
export const dashboardNavItems: NavItem[] = [
  { label: "Centro de navegación", icon: "⌂", href: "/" },
  { label: "Pacientes", icon: "◎", count: 124, href: "/pacientes" },
  { label: "CRM WhatsApp", icon: "◉", count: 12, href: "/whatsapp" },
  {
    label: "Conciliación",
    icon: "↔",
    count: 6,
    countLabel: "Historias clínicas pendientes de verificación humana",
    href: "/conciliacion",
  },
  { label: "Órdenes", icon: "▤", count: 27, href: "/ordenes" },
  { label: "Referencia", icon: "↗", count: 12, href: "/referencia" },
  { label: "Indicadores", icon: "▥", href: "/indicadores" },
];

export const workItems: WorkItem[] = [
  {
    initials: "ML",
    name: "María Fernanda López",
    record: "VN-260812-041",
    age: "57 años",
    service: "Quimioterapia",
    priority: "Alta · 48 h",
    priorityTone: "red",
    sla: "Vence hoy",
    slaTone: "red",
    action: "Validar orden de catéter",
    elapsed: "Hace 18 min",
  },
  {
    initials: "CG",
    name: "Carlos Andrés Gómez",
    record: "VN-260812-036",
    age: "64 años",
    service: "Cirugía",
    priority: "Media · 7 días",
    priorityTone: "amber",
    sla: "2 días vencido",
    slaTone: "red",
    action: "Escalar autorización",
    elapsed: "Hace 31 min",
  },
  {
    initials: "AR",
    name: "Ana Lucía Rodríguez",
    record: "VN-260811-118",
    age: "48 años",
    service: "Paciente sospechoso",
    priority: "Alta · 72 h",
    priorityTone: "red",
    sla: "Vence en 20 h",
    slaTone: "amber",
    action: "Confirmar biopsia",
    elapsed: "Hace 46 min",
  },
  {
    initials: "JP",
    name: "Jorge Pablo Méndez",
    record: "VN-260810-092",
    age: "61 años",
    service: "Radioterapia",
    priority: "Media · 5 días",
    priorityTone: "amber",
    sla: "En seguimiento",
    slaTone: "green",
    action: "Revisar programación",
    elapsed: "Hace 1 h",
  },
];

export function formatCurrentDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}
