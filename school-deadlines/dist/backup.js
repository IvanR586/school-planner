'use strict';
el('import-backup').addEventListener('click', () => el('import-planner').click());
function validateBackup(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.tasks) || !Array.isArray(data.exams)) throw Error('Choose a School Planner backup JSON file.');
  if (!data.tasks.every(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.course === 'string' && typeof t.done === 'boolean' && validDate(t.due)) || !data.exams.every(validExam)) throw Error('This backup contains invalid deadlines or exams. Nothing was imported.');
  return data;
}
function mergePlannerRecords(current, incoming) {
  const known = new Set(current.map(item => item.id));
  return [...current, ...incoming.filter(item => { if (known.has(item.id)) return false; known.add(item.id); return true; })];
}
el('export-planner').addEventListener('click', () => {
  const data = { version: 1, exportedAt: new Date().toISOString(), tasks, exams };
  let recovery = document.getElementById('backup-copy');
  if (!recovery) {
    recovery = document.createElement('textarea'); recovery.id = 'backup-copy'; recovery.readOnly = true;
    recovery.setAttribute('aria-label', 'Backup JSON (copy if download is unavailable)');
    recovery.style.cssText = 'width:100%;min-height:120px;font:14px monospace';
    document.querySelector('.backup-controls').append(recovery);
  }
  recovery.value = JSON.stringify(data, null, 2);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = 'school-planner-backup.json';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  el('backup-status').textContent = `Backup prepared: ${tasks.length} assignments and ${exams.length} exam plans. Import it in your other browser.`;
});
el('import-planner').addEventListener('change', async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw Error('Choose a backup smaller than 5 MB.');
    const backup = validateBackup(JSON.parse(await file.text()));
    const mergedTasks = mergePlannerRecords(tasks, backup.tasks), mergedExams = mergePlannerRecords(exams, backup.exams);
    // Preserve the prior browser copy before importing and leave existing IDs untouched.
    const previousTasks = localStorage.getItem(KEY), previousExams = localStorage.getItem(EXAM_KEY);
    localStorage.setItem('portfolio-school-planner-before-import', JSON.stringify({ version: 1, tasks, exams }));
    try {
      localStorage.setItem(KEY, JSON.stringify(mergedTasks));
      localStorage.setItem(EXAM_KEY, JSON.stringify(mergedExams));
    } catch (error) {
      if (previousTasks === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, previousTasks);
      if (previousExams === null) localStorage.removeItem(EXAM_KEY); else localStorage.setItem(EXAM_KEY, previousExams);
      throw error;
    }
    const added = mergedTasks.length - tasks.length + mergedExams.length - exams.length;
    tasks = mergedTasks; exams = mergedExams; render(); renderExams();
    el('backup-status').textContent = `Imported ${added} new items. Existing items were kept; study progress is included.`;
  } catch (error) { el('backup-status').textContent = error instanceof SyntaxError ? 'This file is not valid JSON. Nothing was imported.' : error.message; }
  event.target.value = '';
});
