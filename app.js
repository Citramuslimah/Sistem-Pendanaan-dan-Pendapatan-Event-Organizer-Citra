const ENTITY_CONFIG = {
  categories: {
    title: 'Kategori',
    eyebrow: 'PENGELOMPOKAN',
    description: 'Atur jenis acara untuk menjaga portofolio tetap tertata.',
    icon: '◈',
    empty: 'Belum ada kategori',
    columns: [
      { label: 'Nama kategori', value: (row) => `<span class="primary-cell">${escapeHtml(row.name)}</span>` },
      { label: 'Deskripsi', value: (row) => escapeHtml(row.description || '—') },
      { label: 'Jumlah acara', value: (row) => `${state.data.events.filter((event) => event.category_id === row.id).length} acara` },
    ],
    fields: [
      { key: 'name', label: 'Nama kategori', type: 'text', required: true, placeholder: 'Contoh: Konferensi' },
      { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Catatan singkat tentang kategori' },
    ],
  },
  events: {
    title: 'Acara',
    eyebrow: 'KALENDER KEGIATAN',
    description: 'Kelola agenda, kategori, status, dan anggaran setiap acara.',
    icon: '▦',
    empty: 'Belum ada acara',
    columns: [
      { label: 'Nama acara', value: (row) => `<span class="primary-cell">${escapeHtml(row.name)}</span>` },
      { label: 'Kategori', value: (row) => escapeHtml(findById('categories', row.category_id)?.name || 'Tanpa kategori') },
      { label: 'Tanggal', value: (row) => formatDate(row.event_date) },
      { label: 'Lokasi', value: (row) => escapeHtml(row.location || '—') },
      { label: 'Status', value: (row) => statusBadge(row.status) },
      { label: 'Anggaran', value: (row) => formatCurrency(row.budget) },
    ],
    fields: [
      { key: 'name', label: 'Nama acara', type: 'text', required: true, placeholder: 'Contoh: Citra Annual Summit' },
      { key: 'category_id', label: 'Kategori', type: 'select', options: 'categories', emptyOption: 'Tanpa kategori' },
      { key: 'event_date', label: 'Tanggal acara', type: 'date', required: true },
      { key: 'location', label: 'Lokasi', type: 'text', placeholder: 'Nama tempat atau kota' },
      { key: 'status', label: 'Status acara', type: 'select', required: true, options: [
        { value: 'planning', label: 'Perencanaan' },
        { value: 'active', label: 'Berlangsung' },
        { value: 'completed', label: 'Selesai' },
        { value: 'cancelled', label: 'Dibatalkan' },
      ] },
      { key: 'budget', label: 'Anggaran (Rp)', type: 'number', required: true, min: 0, step: 1000, placeholder: '0' },
    ],
  },
  fundings: {
    title: 'Pendanaan',
    eyebrow: 'ARUS DANA MASUK',
    description: 'Catat sponsor, investor, dan sumber pendanaan untuk setiap acara.',
    icon: '↗',
    empty: 'Belum ada catatan pendanaan',
    columns: [
      { label: 'Sumber dana', value: (row) => `<span class="primary-cell">${escapeHtml(row.funder)}</span>` },
      { label: 'Acara', value: (row) => escapeHtml(findById('events', row.event_id)?.name || 'Acara tidak tersedia') },
      { label: 'Tanggal diterima', value: (row) => formatDate(row.funded_on) },
      { label: 'Nominal', value: (row) => `<span class="primary-cell">${formatCurrency(row.amount)}</span>` },
      { label: 'Keterangan', value: (row) => escapeHtml(row.description || '—') },
    ],
    fields: [
      { key: 'event_id', label: 'Acara', type: 'select', required: true, options: 'events', emptyOption: 'Pilih acara' },
      { key: 'funder', label: 'Sumber pendanaan', type: 'text', required: true, placeholder: 'Contoh: Sponsor utama' },
      { key: 'amount', label: 'Nominal (Rp)', type: 'number', required: true, min: 1, step: 1000, placeholder: '0' },
      { key: 'funded_on', label: 'Tanggal diterima', type: 'date', required: true },
      { key: 'description', label: 'Keterangan', type: 'textarea', placeholder: 'Catatan tambahan (opsional)' },
    ],
  },
  incomes: {
    title: 'Pendapatan',
    eyebrow: 'HASIL KEGIATAN',
    description: 'Kelola tiket, penjualan, dan pendapatan lain yang dihasilkan acara.',
    icon: '↙',
    empty: 'Belum ada catatan pendapatan',
    columns: [
      { label: 'Sumber pendapatan', value: (row) => `<span class="primary-cell">${escapeHtml(row.source)}</span>` },
      { label: 'Acara', value: (row) => escapeHtml(findById('events', row.event_id)?.name || 'Acara tidak tersedia') },
      { label: 'Tanggal diterima', value: (row) => formatDate(row.received_on) },
      { label: 'Nominal', value: (row) => `<span class="primary-cell">${formatCurrency(row.amount)}</span>` },
      { label: 'Keterangan', value: (row) => escapeHtml(row.description || '—') },
    ],
    fields: [
      { key: 'event_id', label: 'Acara', type: 'select', required: true, options: 'events', emptyOption: 'Pilih acara' },
      { key: 'source', label: 'Sumber pendapatan', type: 'text', required: true, placeholder: 'Contoh: Penjualan tiket' },
      { key: 'amount', label: 'Nominal (Rp)', type: 'number', required: true, min: 1, step: 1000, placeholder: '0' },
      { key: 'received_on', label: 'Tanggal diterima', type: 'date', required: true },
      { key: 'description', label: 'Keterangan', type: 'textarea', placeholder: 'Catatan tambahan (opsional)' },
    ],
  },
};

const state = {
  currentView: 'dashboard',
  data: { categories: [], events: [], fundings: [], incomes: [] },
  query: '',
  editing: null,
  loadError: '',
  session: null,
};

const content = document.querySelector('#view-content');
const dialog = document.querySelector('#record-dialog');
const form = document.querySelector('#record-form');
const appShell = document.querySelector('#app-shell');
const authGate = document.querySelector('#auth-gate');
const configForm = document.querySelector('#config-form');
const loginForm = document.querySelector('#login-form');
const authMessage = document.querySelector('#auth-message');
const CONFIG_STORAGE_KEY = 'citra-supabase-config';
let supabaseClient = null;
let toastTimer;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function formatDate(value, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('id-ID', options).format(date);
}

function findById(entity, id) {
  return state.data[entity].find((record) => record.id === id);
}

function statusBadge(status) {
  const labels = { planning: 'Perencanaan', active: 'Berlangsung', completed: 'Selesai', cancelled: 'Dibatalkan' };
  return `<span class="status-pill status-${escapeHtml(status)}">${labels[status] || escapeHtml(status || 'Perencanaan')}</span>`;
}

function setConnection(online) {
  const dot = document.querySelector('#connection-dot');
  dot.className = `connection-dot ${online ? 'is-online' : 'is-offline'}`;
  document.querySelector('#connection-label').textContent = online ? 'Supabase terhubung' : 'Supabase tidak terhubung';
}

function getSupabaseConfig() {
  try {
    const savedConfig = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY) || 'null');
    if (savedConfig?.url && savedConfig?.publishableKey) return savedConfig;
  } catch {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  }
  return window.CITRA_SUPABASE_CONFIG || {};
}

function showAuthGate(mode, message = '') {
  appShell.hidden = true;
  authGate.hidden = false;
  configForm.hidden = mode !== 'setup';
  loginForm.hidden = mode !== 'login';
  authMessage.textContent = message;
  document.querySelector('#auth-title').textContent = mode === 'setup' ? 'Hubungkan Supabase' : 'Masuk ke workspace';
  document.querySelector('#auth-description').textContent = mode === 'setup'
    ? 'Masukkan publishable key project. Key ini aman digunakan di browser; jangan masukkan secret key.'
    : 'Gunakan akun yang sudah terdaftar pada Authentication di project Supabase.';
}

async function initializeSupabase() {
  const config = getSupabaseConfig();
  if (!config.url || !config.publishableKey) {
    configForm.elements.url.value = config.url || '';
    showAuthGate('setup');
    return;
  }
  if (!window.supabase?.createClient) {
    showAuthGate('setup', 'Library Supabase tidak termuat. Periksa koneksi internet lalu muat ulang halaman.');
    return;
  }

  supabaseClient = window.supabase.createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    showAuthGate('login', error.message);
    return;
  }
  state.session = data.session;
  if (state.session) {
    showApplication();
  } else {
    showAuthGate('login');
  }
}

function showApplication() {
  authGate.hidden = true;
  appShell.hidden = false;
  document.querySelector('#signed-in-email').textContent = state.session?.user?.email || 'Pengguna';
  loadData();
}

async function apiRequest(entity, method = 'GET', id, payload) {
  if (!supabaseClient || !state.session) throw new Error('Sesi Supabase berakhir. Silakan masuk kembali.');
  let query = supabaseClient.from(entity);
  if (method === 'GET') query = query.select('*').order('created_at', { ascending: false });
  if (method === 'POST') query = query.insert(payload).select('*');
  if (method === 'PATCH') query = query.update(payload).eq('id', id).select('*');
  if (method === 'DELETE') query = query.delete().eq('id', id).select('*');
  const { data, error } = await query;
  if (error) throw new Error([error.message, error.details, error.hint].filter(Boolean).join(' '));
  return data || [];
}

async function loadData() {
  if (!state.session) return;
  try {
    const entities = Object.keys(ENTITY_CONFIG);
    const records = await Promise.all(entities.map((entity) => apiRequest(entity)));
    state.data = Object.fromEntries(entities.map((entity, index) => [entity, records[index]]));
    state.loadError = '';
    setConnection(true);
  } catch (error) {
    state.loadError = error.message;
    setConnection(false);
  }
  document.querySelector('#event-count').textContent = state.data.events.length;
  renderCurrentView();
}

function setHeading(title) {
  document.querySelector('#breadcrumb-current').textContent = title;
  document.querySelectorAll('.nav-link').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === state.currentView);
  });
  document.querySelector('#header-add').hidden = state.currentView === 'dashboard';
}

function renderErrorNotice() {
  if (!state.loadError) return '';
  return `<div class="notice"><strong>Sinkronisasi Supabase gagal.</strong> ${escapeHtml(state.loadError)} Pastikan skema dan policy pada <strong>backend/schema.sql</strong> sudah dijalankan.</div>`;
}

function pageHeading(title, eyebrow, description, addLabel = 'Tambah data') {
  return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div><button class="button button-primary" type="button" data-action="create"><span class="button-plus">+</span> ${addLabel}</button></div>`;
}

function renderCurrentView() {
  const config = ENTITY_CONFIG[state.currentView];
  if (state.currentView === 'dashboard') {
    setHeading('Ikhtisar');
    content.innerHTML = `${renderErrorNotice()}${renderDashboard()}`;
    return;
  }
  setHeading(config.title);
  content.innerHTML = `${renderErrorNotice()}${pageHeading(config.title, config.eyebrow, config.description, `Tambah ${config.title.toLowerCase()}`)}${renderEntityTable(state.currentView)}`;
}

function renderDashboard() {
  const totals = {
    funding: state.data.fundings.reduce((total, row) => total + Number(row.amount || 0), 0),
    income: state.data.incomes.reduce((total, row) => total + Number(row.amount || 0), 0),
  };
  const upcoming = state.data.events
    .filter((event) => event.status !== 'completed' && event.status !== 'cancelled')
    .sort((first, second) => first.event_date.localeCompare(second.event_date))
    .slice(0, 4);
  return `
    ${pageHeading('Ruang kendali acara', 'PERUSAHAAN CITRA · OPERASIONAL', 'Pantau kegiatan dan aliran dana dalam satu tempat.', 'Tambah acara')}
    <div class="stats-grid">
      ${statCard('Total acara', state.data.events.length, 'terdaftar dalam sistem', '▦', '')}
      ${statCard('Kategori', state.data.categories.length, 'jenis kegiatan', '◈', 'gold')}
      ${statCard('Total pendanaan', formatCompactCurrency(totals.funding), 'dana yang sudah dicatat', '↗', '')}
      ${statCard('Total pendapatan', formatCompactCurrency(totals.income), 'hasil yang sudah dicatat', '↙', 'coral')}
    </div>
    <div class="overview-grid">
      <section class="panel flow-panel">
        <div class="panel-heading"><div><h2>Ringkasan arus dana</h2><p>Perbandingan pendanaan dan pendapatan enam bulan terakhir</p></div><div class="legend"><span><i></i>Pendanaan</span><span><i></i>Pendapatan</span></div></div>
        ${renderFlowChart()}
        <div class="flow-summary"><div class="flow-item"><span>Total pendanaan</span><strong>${formatCurrency(totals.funding)}</strong></div><div class="flow-item income"><span>Total pendapatan</span><strong>${formatCurrency(totals.income)}</strong></div></div>
      </section>
      <section class="panel upcoming-panel">
        <div class="panel-heading"><div><h2>Agenda acara</h2><p>${upcoming.length ? 'Kegiatan yang perlu dipantau' : 'Belum ada agenda mendatang'}</p></div><button class="text-button" type="button" data-view="events">Semua acara →</button></div>
        <div class="upcoming-list">${upcoming.length ? upcoming.map(renderUpcomingEvent).join('') : `<div class="empty-state"><div class="empty-icon">▦</div><strong>Belum ada acara</strong><p>Tambahkan acara untuk mulai mengatur agenda.</p><button class="button button-quiet" type="button" data-action="create-event">Tambah acara</button></div>`}</div>
      </section>
    </div>`;
}

function statCard(label, value, caption, icon, color) {
  return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-mark ${color}">${icon}</span></div><strong class="stat-value">${value}</strong><span class="stat-foot">${caption}</span></article>`;
}

function formatCompactCurrency(value) {
  const amount = Number(value) || 0;
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;
  if (amount >= 1000) return `Rp ${(amount / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} rb`;
  return formatCurrency(amount);
}

function renderFlowChart() {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 5 + index, 1));
  const values = months.map((month) => {
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    const funding = sumForMonth(state.data.fundings, 'funded_on', key);
    const income = sumForMonth(state.data.incomes, 'received_on', key);
    return { month, funding, income };
  });
  const max = Math.max(1, ...values.flatMap((value) => [value.funding, value.income]));
  return `<div class="flow-chart">${values.map((value) => `<div class="flow-column"><span class="flow-bar" style="height:${Math.max(3, value.funding / max * 100)}%" title="Pendanaan ${formatCurrency(value.funding)}"></span><span class="flow-bar income-bar" style="height:${Math.max(3, value.income / max * 100)}%" title="Pendapatan ${formatCurrency(value.income)}"></span></div>`).join('')}</div><div class="flow-months">${values.map(({ month }) => `<span>${new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(month)}</span>`).join('')}</div>`;
}

function sumForMonth(records, dateField, monthKey) {
  return records.reduce((sum, row) => row[dateField]?.startsWith(monthKey) ? sum + Number(row.amount || 0) : sum, 0);
}

function renderUpcomingEvent(event) {
  const date = event.event_date ? new Date(`${event.event_date}T00:00:00`) : null;
  const day = date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat('id-ID', { day: 'numeric' }).format(date) : '—';
  const month = date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date) : '—';
  return `<div class="upcoming-row"><div class="date-block"><strong>${day}</strong><small>${month}</small></div><div class="upcoming-info"><strong>${escapeHtml(event.name)}</strong><small>${escapeHtml(findById('categories', event.category_id)?.name || event.location || 'Acara')}</small></div>${statusBadge(event.status)}</div>`;
}

function renderEntityTable(entity, filterText = state.query) {
  const config = ENTITY_CONFIG[entity];
  const records = state.data[entity];
  const normalized = filterText.trim().toLocaleLowerCase('id-ID');
  const filtered = records.filter((record) => {
    if (!normalized) return true;
    const related = entity === 'events'
      ? findById('categories', record.category_id)?.name
      : ['fundings', 'incomes'].includes(entity) ? findById('events', record.event_id)?.name : '';
    return `${Object.values(record).join(' ')} ${related || ''}`.toLocaleLowerCase('id-ID').includes(normalized);
  });
  const heading = config.columns.map((column) => `<th>${column.label}</th>`).join('');
  const rows = filtered.map((record) => `<tr>${config.columns.map((column) => `<td>${column.value(record)}</td>`).join('')}<td><div class="row-actions"><button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(record.id)}" title="Edit" aria-label="Edit">✎</button><button class="icon-button delete" type="button" data-action="delete" data-id="${escapeHtml(record.id)}" title="Hapus" aria-label="Hapus">×</button></div></td></tr>`).join('');
  const empty = `<tr><td colspan="${config.columns.length + 1}"><div class="empty-state"><div class="empty-icon">${config.icon}</div><strong>${normalized ? 'Data tidak ditemukan' : config.empty}</strong><p>${normalized ? 'Coba kata kunci lain.' : 'Tambahkan data pertama untuk mulai mengelola informasi.'}</p>${normalized ? '' : `<button class="button button-quiet" type="button" data-action="create">Tambah ${config.title.toLowerCase()}</button>`}</div></td></tr>`;
  return `<div class="content-toolbar"><label class="search-wrap"><input class="search-input" id="record-search" type="search" placeholder="Cari ${config.title.toLowerCase()}..." value="${escapeHtml(filterText)}" aria-label="Cari ${config.title.toLowerCase()}"></label><span class="result-count">${filtered.length} dari ${records.length} data</span></div><div class="table-wrap"><table class="data-table"><thead><tr>${heading}<th><span class="sr-only">Aksi</span></th></tr></thead><tbody>${rows || empty}</tbody></table></div>`;
}

function getOptions(field) {
  if (Array.isArray(field.options)) return field.options;
  return state.data[field.options].map((item) => ({ value: item.id, label: item.name }));
}

function renderField(field, record) {
  const value = record?.[field.key] ?? (field.type === 'date' ? new Date().toISOString().slice(0, 10) : '');
  const required = field.required ? 'required' : '';
  const hint = field.hint ? `<small class="field-hint">${field.hint}</small>` : '';
  let control;
  if (field.type === 'select') {
    const options = getOptions(field);
    const emptyOption = field.emptyOption ? `<option value="">${field.emptyOption}</option>` : '';
    control = `<select class="field-control" name="${field.key}" ${required}>${emptyOption}${options.map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select>`;
  } else if (field.type === 'textarea') {
    control = `<textarea class="field-control" name="${field.key}" placeholder="${escapeHtml(field.placeholder || '')}">${escapeHtml(value)}</textarea>`;
  } else {
    control = `<input class="field-control" name="${field.key}" type="${field.type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(field.placeholder || '')}" ${required} ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.step ? `step="${field.step}"` : ''}>`;
  }
  return `<label class="field-label">${field.label}${control}${hint}</label>`;
}

function openForm(entity, record = null) {
  if (['fundings', 'incomes'].includes(entity) && !state.data.events.length) {
    showToast('Tambahkan acara terlebih dahulu.', true);
    return;
  }
  const config = ENTITY_CONFIG[entity];
  state.editing = { entity, id: record?.id };
  document.querySelector('#dialog-eyebrow').textContent = record ? `EDIT ${config.eyebrow}` : `DATA BARU · ${config.eyebrow}`;
  document.querySelector('#dialog-title').textContent = record ? `Edit ${config.title.toLowerCase()}` : `Tambah ${config.title.toLowerCase()}`;
  document.querySelector('#save-button').textContent = record ? 'Simpan perubahan' : 'Simpan data';
  document.querySelector('#form-fields').innerHTML = config.fields.map((field) => renderField(field, record)).join('');
  dialog.showModal();
  document.querySelector('#form-fields .field-control')?.focus();
}

function showToast(message, isError = false) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.toggle('is-error', isError);
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function setView(view) {
  if (view !== 'dashboard' && !ENTITY_CONFIG[view]) return;
  state.currentView = view;
  state.query = '';
  renderCurrentView();
}

content.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    setView(viewButton.dataset.view);
    return;
  }
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  const entity = state.currentView === 'dashboard' ? 'events' : state.currentView;
  if (action === 'create' || action === 'create-event') openForm(entity);
  if (action === 'edit') openForm(entity, findById(entity, actionButton.dataset.id));
  if (action === 'delete') deleteRecord(entity, actionButton.dataset.id);
});

document.querySelectorAll('.nav-link').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
document.querySelector('#header-add').addEventListener('click', () => openForm(state.currentView));
content.addEventListener('input', (event) => {
  if (!event.target.matches('#record-search')) return;
  state.query = event.target.value;
  const cursor = event.target.selectionStart;
  const renderedTable = renderEntityTable(state.currentView, state.query);
  const tableMarkup = renderedTable.match(/<div class="table-wrap">[\s\S]*<\/div>$/)?.[0];
  if (tableMarkup) content.querySelector('.table-wrap').outerHTML = tableMarkup;
  const input = content.querySelector('#record-search');
  if (input) {
    input.value = state.query;
    input.focus();
    input.setSelectionRange(cursor, cursor);
  }
  const oldCount = content.querySelector('.result-count');
  const newCount = renderedTable.match(/<span class="result-count">[\s\S]*?<\/span>/)?.[0];
  if (oldCount && newCount) oldCount.outerHTML = newCount;
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

configForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = configForm.elements.url.value.trim().replace(/\/$/, '');
  const publishableKey = configForm.elements.publishable_key.value.trim();
  if (!url.startsWith('https://') || !publishableKey) {
    authMessage.textContent = 'Masukkan URL HTTPS dan publishable key Supabase yang valid.';
    return;
  }
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ url, publishableKey }));
  configForm.reset();
  await initializeSupabase();
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = loginForm.querySelector('[type="submit"]');
  submitButton.disabled = true;
  authMessage.textContent = '';
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: loginForm.elements.email.value.trim(),
      password: loginForm.elements.password.value,
    });
    if (error) throw error;
    state.session = data.session;
    loginForm.reset();
    showApplication();
  } catch (error) {
    authMessage.textContent = error.message || 'Tidak dapat masuk ke Supabase.';
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector('#change-config').addEventListener('click', () => {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  supabaseClient?.auth.signOut();
  state.session = null;
  const config = window.CITRA_SUPABASE_CONFIG || {};
  configForm.elements.url.value = config.url || '';
  showAuthGate('setup');
});

document.querySelector('#sign-out').addEventListener('click', async () => {
  await supabaseClient?.auth.signOut();
  state.session = null;
  showAuthGate('login');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.editing) return;
  const { entity, id } = state.editing;
  const config = ENTITY_CONFIG[entity];
  const payload = Object.fromEntries(config.fields.map((field) => {
    const value = new FormData(form).get(field.key);
    if (field.key === 'category_id' || field.key === 'event_id') return [field.key, value || null];
    if (field.type === 'number') return [field.key, Number(value) || 0];
    return [field.key, typeof value === 'string' ? value.trim() : value];
  }));
  const saveButton = document.querySelector('#save-button');
  saveButton.disabled = true;
  try {
    await apiRequest(entity, id ? 'PATCH' : 'POST', id, payload);
    dialog.close();
    await loadData();
    showToast(id ? 'Perubahan berhasil disimpan.' : 'Data berhasil ditambahkan.');
  } catch (error) {
    showToast(error.message, true);
  } finally {
    saveButton.disabled = false;
  }
});

async function deleteRecord(entity, id) {
  const record = findById(entity, id);
  const name = record?.name || record?.funder || record?.source || 'data ini';
  const dependentWarning = entity === 'events' ? '\nCatatan pendanaan dan pendapatan terkait juga akan dihapus.' : '';
  if (!window.confirm(`Hapus "${name}"?${dependentWarning}`)) return;
  try {
    await apiRequest(entity, 'DELETE', id);
    await loadData();
    showToast('Data berhasil dihapus.');
  } catch (error) {
    showToast(error.message, true);
  }
}

document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
renderCurrentView();
initializeSupabase();
