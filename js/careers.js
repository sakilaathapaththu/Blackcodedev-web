/* ======= CONFIG ======= 
     If your API runs on a different origin/port in dev, change API_BASE.
     For same-origin deploys (API served by same domain), set ''.
  */
  const API_BASE = 'http://localhost:4000'; // e.g. 'http://localhost:4000' for local dev

  // ---------- NAV + MOBILE MENU ----------
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 100) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  });

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menu-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('show');
      });
    }
  });

  // ---------- BACKGROUND PARTICLES ----------
  function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = (80 + Math.random() * 20) + 'vh';
      const size = 1 + Math.random() * 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDelay = (Math.random() * 6) + 's';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      particlesContainer.appendChild(p);
    }
  }
  document.addEventListener('DOMContentLoaded', createParticles);

  // ---------- HELPERS ----------
  function escapeHtml(s = '') {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // Ensure hidden fields exist in the form (jobId, position)
  function ensureHiddenFields() {
    const form = document.getElementById('applicationForm');
    if (!form) return;

    let jobId = document.getElementById('jobId');
    if (!jobId) {
      jobId = document.createElement('input');
      jobId.type = 'hidden';
      jobId.id = 'jobId';
      jobId.name = 'jobId';
      form.appendChild(jobId);
    }

    let position = document.getElementById('position');
    if (!position) {
      position = document.createElement('input');
      position.type = 'hidden';
      position.id = 'position';
      position.name = 'position';
      form.appendChild(position);
    }
  }

  // ---------- JOBS: FETCH + RENDER ----------
  async function loadJobs() {
    const grid = document.getElementById('jobsGrid');
    if (!grid) return;
    grid.innerHTML = `<div class="job-card"><p class="job-description">Loading openings…</p></div>`;

    try {
      const res = await fetch(`${API_BASE}/api/jobs`);
      if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`);
      const jobs = await res.json();

      if (!Array.isArray(jobs) || jobs.length === 0) {
        grid.innerHTML = `<div class="job-card"><p class="job-description">No openings right now. Please check back soon.</p></div>`;
        return;
      }

      grid.innerHTML = '';
      jobs.forEach((job, index) => {
        const card = renderJobCard(job);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      grid.innerHTML = `<div class="job-card"><p class="job-description">Could not load jobs. Please refresh.</p></div>`;
    }
  }

  function renderJobCard(job) {
    const el = document.createElement('div');
    el.className = 'job-card';

    const reqList = (job.requirements || []).map(r =>
      `<li>${escapeHtml(String(r))}</li>`
    ).join('');

    el.innerHTML = `
      <h3 class="job-title">${escapeHtml(job.title || 'Untitled Role')}</h3>
      <div class="job-department">${escapeHtml(job.department || '')}</div>
      <div class="job-location"><span>📍</span><span>${escapeHtml(job.location || '')}</span></div>
      <p class="job-description">${escapeHtml(job.description || '')}</p>
      <div class="job-requirements">
        <h4>Key Requirements:</h4>
        <ul class="requirements-list">${reqList}</ul>
      </div>
      <button class="apply-btn">Apply Now</button>
    `;

    el.querySelector('.apply-btn').addEventListener('click', () => openModal(job));
    return el;
  }

  // ---------- MODAL + APPLICATION SUBMIT ----------
  function openModal(job) {
    ensureHiddenFields();

    const title = job?.title ? `Apply for ${job.title}` : 'Apply for Position';
    document.getElementById('modalJobTitle').textContent = title;
    document.getElementById('applicationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';

    // attach job info to hidden fields for backend
    document.getElementById('jobId').value = job?._id || '';
    document.getElementById('position').value = job?.title || '';
  }

  function closeModal() {
    document.getElementById('applicationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    const form = document.getElementById('applicationForm');
    if (form) form.reset();
    const fileName = document.getElementById('fileName');
    if (fileName) fileName.textContent = '';
  }

  // Close modal: click outside
  document.getElementById('applicationModal')?.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // Close modal: Esc
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // File name preview
  function updateFileName() {
    const fileInput = document.getElementById('cv');
    const fileName = document.getElementById('fileName');
    if (!fileInput || !fileName) return;

    if (fileInput.files.length > 0) {
      fileName.textContent = `Selected: ${fileInput.files[0].name}`;
      fileName.style.color = 'rgba(255, 255, 255, 0.9)';
    } else {
      fileName.textContent = '';
    }
  }
  // expose for inline onchange
  window.updateFileName = updateFileName;

  // Submit application
  document.getElementById('applicationForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    // Basic client-side validations
    if (!formData.get('jobId')) {
      alert('Please select a job from the list before applying.');
      return;
    }
    if (!formData.get('cv')) {
      alert('Please attach your CV/Resume.');
      return;
    }

    const submitBtn = formEl.querySelector('.submit-btn');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';
    }

    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        body: formData
        // NOTE: no credentials and no custom headers needed for multipart
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error || 'Submission failed.';
        alert(`Error: ${msg}`);
        return;
      }

      alert(`Thank you ${formData.get('fullName')}! Your application for ${formData.get('position')} has been submitted successfully.`);
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText || 'Submit Application';
      }
    }
  });

  // ---------- INIT ----------
  document.addEventListener('DOMContentLoaded', () => {
    ensureHiddenFields();
    loadJobs();
  });