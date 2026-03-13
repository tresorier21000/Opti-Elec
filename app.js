// Calculateur d'Électricité Unifié - Version 1.0 (PWA)
// Database & State Management
const DB_KEY = 'calc_elec_profiles_v1';
const DEFAULT_PROFILE = {
    id: 'default_alpiq_2026',
    name: 'Alpiq (Défaut)',
    date: '2026-02-01',
    kwh: { base: 0.178284, hp: 0.189516, hc: 0.145776 },
    subs: {
        '6': { base: 187.80, hphc: 187.80 },
        '9': { base: 234.72, hphc: 234.72 },
        '12': { base: 279.84, hphc: 279.84 }
    }
};

let profiles = [];
let currentMode = 1; // 1: Total Conso, 2: HP Conso

// Initialization
window.onload = () => {
    loadDatabase();
    switchMode(1);
};

function showMessage(msg, type = "info") {
    const m = document.getElementById('sysMsg');

    // Set icon based on type
    let icon = '<i class="fa-solid fa-circle-info"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-check-circle" style="color:var(--success)"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-triangle-exclamation" style="color:var(--danger)"></i>';
    if (type === 'warning') icon = '<i class="fa-solid fa-circle-exclamation" style="color:var(--warning)"></i>';

    m.innerHTML = `${icon} <span>${msg}</span>`;
    m.classList.add('show');

    setTimeout(() => {
        m.classList.remove('show');
    }, 3500);
}

// --- Database Logic ---
function loadDatabase() {
    try {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
            profiles = JSON.parse(stored);
        } else {
            profiles = [JSON.parse(JSON.stringify(DEFAULT_PROFILE))];
        }
    } catch (e) {
        console.error("Erreur de chargement", e);
        profiles = [JSON.parse(JSON.stringify(DEFAULT_PROFILE))];
    }
    refreshProfileSelect();
}

function saveDatabase() {
    localStorage.setItem(DB_KEY, JSON.stringify(profiles));
    refreshProfileSelect();
}

function refreshProfileSelect() {
    const select = document.getElementById('profileSelect');
    const currentSelected = select.value;
    select.innerHTML = '';

    profiles.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        // Format date FR
        const dateStr = p.date ? new Date(p.date).toLocaleDateString('fr-FR') : '';
        opt.textContent = `${p.name} (${dateStr})`;
        select.appendChild(opt);
    });

    if (currentSelected && profiles.find(p => p.id === currentSelected)) {
        select.value = currentSelected;
    }

    // clear result when profile changes
    document.getElementById('resultPanel').style.display = 'none';
}

function getActiveProfile() {
    const id = document.getElementById('profileSelect').value;
    return profiles.find(p => p.id === id) || profiles[0];
}

function loadSelectedProfile() {
    document.getElementById('resultPanel').style.display = 'none';
}

// --- Export / Import ---
function exportDatabase() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tarifs_electricite_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showMessage("Base de données exportée !", "success");
}

function importDatabase(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported) && imported.length > 0) {
                profiles = imported;
                saveDatabase();
                showMessage("Base de données importée avec succès !", "success");
            } else {
                showMessage("Le fichier JSON n'est pas valide ou est vide.", "error");
            }
        } catch (err) {
            showMessage("Erreur lors de la lecture du fichier JSON.", "error");
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset
}

// --- UI Interactions ---
function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-mode="${mode}"]`).classList.add('active');

    const label = document.getElementById('consoLabel');
    const hint = document.getElementById('consoHint');
    const tooltip = document.getElementById('consoTooltip');

    if (mode === 1) {
        label.innerHTML = `
            <span class="text-highlight">Consommation annuelle TOTALE (kWh)</span>
            <div class="tooltip-container inline">
                <i class="fa-solid fa-circle-question help-icon"></i>
                <span class="tooltip-text" id="consoTooltip">Somme de toutes vos consommations (HP + HC) sur une année.</span>
            </div>
        `;
        hint.textContent = "Entrez la somme de toutes vos consommations annuelles pour connaître la répartition idéale et voir ce qui est le plus rentable.";
    } else {
        label.innerHTML = `
            <span class="text-highlight" style="color:var(--text-main)">Consommation Heures Pleines uniquement (kWh)</span>
            <div class="tooltip-container inline">
                <i class="fa-solid fa-circle-question help-icon"></i>
                <span class="tooltip-text" id="consoTooltip">Uniquement la part de votre consommation effectuée pendant les heures pleines.</span>
            </div>
        `;
        hint.textContent = "Entrez uniquement votre consommation effectuée pendant les Heures Pleines pour savoir combien il vous faut consommer en HC.";
    }

    document.getElementById('resultPanel').style.display = 'none';
}

// --- Modal Logic ---
function openProfileModal(isEdit) {
    const modal = document.getElementById('profileModal');
    const btnDelete = document.getElementById('btnDeleteProfile');

    if (isEdit) {
        const profile = getActiveProfile();
        document.getElementById('modalTitle').textContent = "Éditer le profil tarifaire";
        document.getElementById('editId').value = profile.id;
        document.getElementById('editName').value = profile.name;
        document.getElementById('editDate').value = profile.date;

        document.getElementById('editBaseKwh').value = profile.kwh.base;
        document.getElementById('editHpKwh').value = profile.kwh.hp;
        document.getElementById('editHcKwh').value = profile.kwh.hc;

        ['6', '9', '12'].forEach(k => {
            document.getElementById(`editAbo${k}Base`).value = profile.subs[k].base;
            document.getElementById(`editAbo${k}Hphc`).value = profile.subs[k].hphc;
        });

        btnDelete.style.visibility = profiles.length > 1 ? 'visible' : 'hidden';
    } else {
        document.getElementById('modalTitle').textContent = "Nouveau profil tarifaire";
        document.getElementById('editId').value = 'new_' + Date.now();
        document.getElementById('editName').value = '';
        document.getElementById('editDate').value = new Date().toISOString().split('T')[0];

        // Set default based on current
        const baseP = getActiveProfile() || DEFAULT_PROFILE;
        document.getElementById('editBaseKwh').value = baseP.kwh.base;
        document.getElementById('editHpKwh').value = baseP.kwh.hp;
        document.getElementById('editHcKwh').value = baseP.kwh.hc;

        ['6', '9', '12'].forEach(k => {
            document.getElementById(`editAbo${k}Base`).value = baseP.subs[k].base;
            document.getElementById(`editAbo${k}Hphc`).value = baseP.subs[k].hphc;
        });

        btnDelete.style.visibility = 'hidden';
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('profileModal').style.display = 'none';
}

function saveProfile() {
    const id = document.getElementById('editId').value;
    const isNew = id.startsWith('new_');

    const newProfile = {
        id: isNew ? 'prof_' + Date.now() : id,
        name: document.getElementById('editName').value || 'Sans nom',
        date: document.getElementById('editDate').value,
        kwh: {
            base: parseFloat(document.getElementById('editBaseKwh').value) || 0,
            hp: parseFloat(document.getElementById('editHpKwh').value) || 0,
            hc: parseFloat(document.getElementById('editHcKwh').value) || 0
        },
        subs: {
            '6': {
                base: parseFloat(document.getElementById('editAbo6Base').value) || 0,
                hphc: parseFloat(document.getElementById('editAbo6Hphc').value) || 0
            },
            '9': {
                base: parseFloat(document.getElementById('editAbo9Base').value) || 0,
                hphc: parseFloat(document.getElementById('editAbo9Hphc').value) || 0
            },
            '12': {
                base: parseFloat(document.getElementById('editAbo12Base').value) || 0,
                hphc: parseFloat(document.getElementById('editAbo12Hphc').value) || 0
            }
        }
    };

    if (isNew) {
        profiles.push(newProfile);
    } else {
        const idx = profiles.findIndex(p => p.id === id);
        if (idx !== -1) profiles[idx] = newProfile;
    }

    saveDatabase();
    document.getElementById('profileSelect').value = newProfile.id;
    closeModal();
    showMessage(`Profil "${newProfile.name}" sauvegardé.`, "success");
}

function deleteCurrentProfile() {
    if (profiles.length <= 1) {
        showMessage("Impossible de supprimer le seul profil existant.", "warning");
        return;
    }
    if (confirm("Êtes-vous sûr de vouloir supprimer ce profil ?")) {
        const id = document.getElementById('editId').value;
        profiles = profiles.filter(p => p.id !== id);
        saveDatabase();
        closeModal();
        showMessage("Profil supprimé.", "success");
    }
}

// --- Math Engine ---
function calculate() {
    const p = getActiveProfile();
    const kva = document.querySelector('input[name="kva"]:checked').value;
    const conso = parseFloat(document.getElementById('consoInput').value);

    const resultPanel = document.getElementById('resultPanel');
    const rIcon = document.getElementById('resultIcon');
    const rText = document.getElementById('resultText');
    const rVal = document.getElementById('resultValue');
    const rSub = document.getElementById('resultSubtext');

    if (isNaN(conso) || conso <= 0) {
        showMessage("Veuillez entrer une consommation valide (supérieure à 0).", "error");
        return;
    }

    const pb = p.kwh.base, ph = p.kwh.hp, pc = p.kwh.hc;
    const ab = p.subs[kva].base, ah = p.subs[kva].hphc;

    resultPanel.style.display = 'block';
    resultPanel.className = 'result-panel info';

    // Check if denominator is zero or invalid logic
    if (currentMode === 1) { // Mode 1: Total -> finding split
        // logic: (Conso*(pb-pc) + ab - ah) / (ph - pc)
        const denom = ph - pc;
        if (denom === 0) {
            showError("Calcul impossible (les prix HP et HC sont identiques).");
            return;
        }
        const prop_hp = ((conso * (pb - pc)) + (ab - ah)) / (conso * denom);

        if (prop_hp > 1) {
            const totalPrice = conso * pb + ab;
            rIcon.innerHTML = '<i class="fa-solid fa-star"></i>';
            resultPanel.className = 'result-panel info';
            rText.innerHTML = `Contrat <strong>Base</strong> plus avantageux`;
            rVal.innerHTML = '100% Base';
            rSub.innerHTML = `Pour <b>${conso} kWh</b>, l'option Base est toujours moins chère, même si vous faisiez 100% de votre consommation en heures creuses.<br><br><div style="padding: 10px; background: var(--surface-hover); border-radius: var(--radius-sm); border: 1px solid var(--border); text-align: center; margin-top: 10px; color: var(--text-main);"><strong>💶 Coût estimé (Option Base) : ${totalPrice.toFixed(2)} € / an</strong></div>`;
        } else if (prop_hp < 0) {
            const minPrice = conso * pc + ah;
            const maxPrice = conso * ph + ah;
            rIcon.innerHTML = '<i class="fa-solid fa-moon"></i>';
            resultPanel.className = 'result-panel success';
            rText.innerHTML = `Contrat <strong>HP/HC</strong> plus avantageux`;
            rVal.innerHTML = '100% HP/HC';
            rSub.innerHTML = `Pour <b>${conso} kWh</b>, l'option HP/HC est toujours moins chère, peu importe votre répartition.<br><br><div style="padding: 10px; background: var(--surface-hover); border-radius: var(--radius-sm); border: 1px solid var(--border); text-align: center; margin-top: 10px; color: var(--text-main);"><strong>💶 Coût estimé : entre ${minPrice.toFixed(2)} € et ${maxPrice.toFixed(2)} € / an</strong></div>`;
        } else {
            const hp_eq = prop_hp * conso;
            const hc_eq = conso - hp_eq;
            const pct_hc = (hc_eq / conso) * 100;
            const eqPrice = conso * pb + ab;

            rIcon.innerHTML = '<i class="fa-solid fa-scale-balanced"></i>';
            rText.innerHTML = `Le <b>seuil d'équilibre</b> pour ${conso} kWh est de :`;
            rVal.innerHTML = `${hc_eq.toFixed(0)} kWh <span style="font-size:1rem;color:var(--text-muted);font-weight:normal;">en Heures Creuses</span>`;
            rSub.innerHTML = `Si vous consommez <strong>plus de ${pct_hc.toFixed(1)}%</strong> (${hc_eq.toFixed(0)} kWh) de votre énergie pendant les heures creuses, le contrat <b>HP/HC</b> sera plus rentable.<br><br><span style="font-size:0.9em;opacity:0.8;">Sinon, l'option <strong>Base</strong> est meilleure (il vous est alloué ${hp_eq.toFixed(0)} kWh en Heures Pleines).</span><br><br><div style="padding: 10px; background: var(--surface-hover); border-radius: var(--radius-sm); border: 1px solid var(--border); text-align: center; margin-top: 15px; color: var(--text-main);"><strong>💶 Coût total estimé au point d'équilibre : ${eqPrice.toFixed(2)} € / an</strong></div>`;
        }

    } else { // Mode 2: HP entered -> finding required HC
        // logic: hc = (hp*(ph-pb) + ah - ab) / (pb - pc)
        const denom = pb - pc;
        if (denom <= 0) {
            showError("Calcul impossible (le prix de l'option Base n'est pas supérieur à l'option HC).");
            return;
        }

        const hc_eq = ((conso * (ph - pb)) + (ah - ab)) / denom;

        if (hc_eq > 0) {
            const total = conso + hc_eq;
            const pct = (hc_eq / total) * 100;
            const eqPrice = total * pb + ab;

            rIcon.innerHTML = '<i class="fa-solid fa-bullseye"></i>';
            resultPanel.className = 'result-panel info';
            rText.innerHTML = `Pour ${conso} kWh en Heures Pleines, il vous faut consommer au minimum :`;
            rVal.innerHTML = `${hc_eq.toFixed(0)} kWh <span style="font-size:1rem;font-weight:normal;">en Heures Creuses</span>`;
            rSub.innerHTML = `Soit <strong>${pct.toFixed(1)}%</strong> d'une consommation totale de ${(conso + hc_eq).toFixed(0)} kWh pour que le contrat HP/HC devienne rentable par rapport au tarif Base.<br><br><div style="padding: 10px; background: var(--surface-hover); border-radius: var(--radius-sm); border: 1px solid var(--border); text-align: center; margin-top: 15px; color: var(--text-main);"><strong>💶 Coût total estimé au point d'équilibre : ${eqPrice.toFixed(2)} € / an</strong></div>`;
        } else {
            rIcon.innerHTML = '<i class="fa-solid fa-star"></i>';
            resultPanel.className = 'result-panel success';
            rText.innerHTML = 'Option <b>Base</b> plus avantageuse';
            rVal.innerHTML = 'Rentabilité non atteinte';
            rSub.innerHTML = `Avec vos ${conso} kWh en HP, l'option Base est d'office plus avantageuse.`;
        }
    }
}

function showError(msg) {
    const resultPanel = document.getElementById('resultPanel');
    resultPanel.className = 'result-panel error';
    document.getElementById('resultIcon').innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    document.getElementById('resultText').innerHTML = msg;
    document.getElementById('resultValue').innerHTML = '';
    document.getElementById('resultSubtext').innerHTML = '';
    resultPanel.style.display = 'block';
}

// --- Help Modal Logic ---
function openHelpModal() {
    document.getElementById('helpModal').style.display = 'flex';
}

function closeHelpModal() {
    document.getElementById('helpModal').style.display = 'none';
}
