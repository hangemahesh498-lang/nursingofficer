const fs = require('fs');
const acorn = require('acorn');

const sourceFile = 'public/assets/index-v3-fixed.js';
let content = fs.readFileSync(sourceFile, 'utf8');

const githubHubCode = `
function AdminGithubDeployHub(props) {
  var lang = props.lang || 'mr';
  var showToast = props.showToast || function(m, t) { console.log(t, m); };

  var statusState = k.useState(null);
  var status = statusState[0];
  var setStatus = statusState[1];

  var deployingState = k.useState(false);
  var deploying = deployingState[0];
  var setDeploying = deployingState[1];

  var pullingState = k.useState(false);
  var pulling = pullingState[0];
  var setPulling = pullingState[1];

  var tokenState = k.useState('');
  var token = tokenState[0];
  var setToken = tokenState[1];

  var ownerState = k.useState('HANGEMAHESH498');
  var owner = ownerState[0];
  var setOwner = ownerState[1];

  var repoState = k.useState('nursing-officer');
  var repo = repoState[0];
  var setRepo = repoState[1];

  var branchState = k.useState('main');
  var branch = branchState[0];
  var setBranch = branchState[1];

  var commitMsgState = k.useState('Update Nursing Officer App codebase & questions');
  var commitMsg = commitMsgState[0];
  var setCommitMsg = commitMsgState[1];

  var logsState = k.useState([]);
  var logs = logsState[0];
  var setLogs = logsState[1];

  k.useEffect(function() {
    fetch('/api/admin/github')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data) {
          if (data.github_owner) setOwner(data.github_owner);
          if (data.github_repo) setRepo(data.github_repo);
          if (data.github_branch) setBranch(data.github_branch);
          if (data.github_token) setToken(data.github_token);
          setStatus(data);
        }
      })
      .catch(function(e) { console.warn('GitHub status load notice:', e); });
  }, []);

  var handleSaveConfig = async function() {
    try {
      var res = await fetch('/api/admin/github/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr-admin-01' },
        body: JSON.stringify({
          github_token: token.trim(),
          github_owner: owner.trim(),
          github_repo: repo.trim(),
          github_branch: branch.trim()
        })
      });
      var data = await res.json();
      if (res.ok) {
        showToast(lang === 'mr' ? '✅ GitHub सेटिंग्ज सुरक्षितपणे सेव्ह झाल्या!' : '✅ GitHub configuration saved!', 'success');
      } else {
        showToast(data.error || 'Failed to save config', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  var handleDeployPush = async function() {
    if (deploying) return;
    setDeploying(true);
    setLogs(['[START] 🚀 Uploading & pushing codebase to GitHub repository...']);
    try {
      var res = await fetch('/api/admin/github/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr-admin-01' },
        body: JSON.stringify({
          github_token: token.trim() || undefined,
          github_owner: owner.trim() || undefined,
          github_repo: repo.trim() || undefined,
          github_branch: branch.trim() || undefined,
          commitMessage: commitMsg.trim() || 'Update Nursing Officer App'
        })
      });
      var data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
      if (data.success) {
        showToast(lang === 'mr' ? '🎉 संपूर्ण कोड GitHub वर यशस्वीरीत्या अपलोड झाला!' : '🎉 Codebase successfully pushed to GitHub!', 'success');
      } else {
        showToast(data.error || 'GitHub push failed', 'error');
        if (data.error) setLogs(function(prev) { return prev.concat(['❌ त्रुटी: ' + data.error]); });
      }
    } catch (err) {
      setLogs(function(prev) { return prev.concat(['❌ त्रुटी: ' + err.message]); });
      showToast(err.message, 'error');
    } finally {
      setDeploying(false);
    }
  };

  var handlePullLatest = async function() {
    if (pulling) return;
    setPulling(true);
    setLogs(['[START] 🔄 Fetching latest updates from GitHub...']);
    try {
      var res = await fetch('/api/admin/github/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr-admin-01' }
      });
      var data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
      if (data.success) {
        showToast(lang === 'mr' ? '✅ GitHub वरून नवीन कोड यशस्वीरित्या प्राप्त झाला!' : '✅ Pulled latest code from GitHub!', 'success');
      } else {
        showToast(data.error || 'GitHub pull failed', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPulling(false);
    }
  };

  return e.jsxs('div', {
    className: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl text-white space-y-6',
    children: [
      e.jsxs('div', {
        className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4',
        children: [
          e.jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              e.jsx('div', {
                className: 'w-11 h-11 rounded-2xl bg-white text-slate-950 flex items-center justify-center font-black text-2xl shadow-md shrink-0',
                children: '🐙'
              }),
              e.jsxs('div', {
                children: [
                  e.jsx('h3', {
                    className: 'font-extrabold text-base text-white tracking-tight',
                    children: lang === 'mr' ? '🚀 GitHub कोड अपलोड व रिपॉझिटरी सिंक हब' : '🚀 GitHub Repository Push & Code Sync Hub'
                  }),
                  e.jsxs('p', {
                    className: 'text-xs text-slate-400 font-medium',
                    children: [
                      lang === 'mr' ? 'येथून संपूर्ण ॲपचा कोड थेट ' : 'Push and sync entire codebase directly with ',
                      e.jsx('span', { className: 'text-indigo-300 font-mono font-bold', children: 'github.com/' + owner + '/' + repo }),
                      lang === 'mr' ? ' वर अपलोड करा.' : '.'
                    ]
                  })
                ]
              })
            ]
          }),
          e.jsx('a', {
            href: 'https://github.com/' + owner + '/' + repo,
            target: '_blank',
            rel: 'noreferrer',
            className: 'px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition text-center shrink-0 cursor-pointer',
            children: '🔗 GitHub वर उघडा (Open Repo)'
          })
        ]
      }),

      e.jsxs('div', {
        className: 'bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-4 text-xs',
        children: [
          e.jsx('h4', {
            className: 'font-bold text-slate-200 flex items-center gap-2',
            children: lang === 'mr' ? '⚙️ GitHub क्रेडेंशियल्स व रिपॉझिटरी सेटिंग्ज:' : '⚙️ GitHub Repository & Token Configuration:'
          }),
          e.jsxs('div', {
            className: 'grid grid-cols-1 sm:grid-cols-3 gap-3',
            children: [
              e.jsxs('div', {
                children: [
                  e.jsx('label', { className: 'block font-bold text-slate-300 mb-1', children: 'GitHub Username / Owner:' }),
                  e.jsx('input', {
                    type: 'text',
                    value: owner,
                    onChange: function(v) { setOwner(v.target.value); },
                    placeholder: 'HANGEMAHESH498',
                    className: 'w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-indigo-500'
                  })
                ]
              }),
              e.jsxs('div', {
                children: [
                  e.jsx('label', { className: 'block font-bold text-slate-300 mb-1', children: 'Repository Name:' }),
                  e.jsx('input', {
                    type: 'text',
                    value: repo,
                    onChange: function(v) { setRepo(v.target.value); },
                    placeholder: 'nursing-officer',
                    className: 'w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-indigo-500'
                  })
                ]
              }),
              e.jsxs('div', {
                children: [
                  e.jsx('label', { className: 'block font-bold text-slate-300 mb-1', children: 'Branch Name:' }),
                  e.jsx('input', {
                    type: 'text',
                    value: branch,
                    onChange: function(v) { setBranch(v.target.value); },
                    placeholder: 'main',
                    className: 'w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-indigo-500'
                  })
                ]
              })
            ]
          }),

          e.jsxs('div', {
            children: [
              e.jsx('label', { className: 'block font-bold text-slate-300 mb-1', children: 'GitHub Personal Access Token (PAT):' }),
              e.jsx('input', {
                type: 'password',
                value: token,
                onChange: function(v) { setToken(v.target.value); },
                placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                className: 'w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-indigo-500'
              }),
              e.jsx('span', {
                className: 'text-[11px] text-slate-400 mt-1 block',
                children: lang === 'mr' ? 'टोकन तयार करण्यासाठी: GitHub Settings -> Developer settings -> Personal access tokens (repo access select करा).' : 'Generate PAT at GitHub Settings -> Developer settings -> Personal access tokens (with repo scope).'
              })
            ]
          }),

          e.jsxs('div', {
            className: 'flex items-center justify-between pt-1',
            children: [
              e.jsx('button', {
                type: 'button',
                onClick: handleSaveConfig,
                className: 'px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition cursor-pointer',
                children: lang === 'mr' ? '💾 सेटिंग्ज सेव्ह करा (Save Config)' : '💾 Save GitHub Config'
              }),
              status && status.last_github_deploy_at && e.jsxs('span', {
                className: 'text-[11px] text-slate-400 font-mono',
                children: ['शेवटचा डिप्लोय: ', new Date(status.last_github_deploy_at).toLocaleString('mr-IN')]
              })
            ]
          })
        ]
      }),

      e.jsxs('div', {
        className: 'bg-slate-800/80 p-5 rounded-xl border border-indigo-900/60 space-y-4 text-xs',
        children: [
          e.jsx('h4', {
            className: 'font-bold text-indigo-300 flex items-center gap-2',
            children: lang === 'mr' ? '🚀 कोड थेट GitHub वर अपलोड करा (Commit & Push to GitHub):' : '🚀 Commit & Push Codebase to GitHub:'
          }),
          e.jsxs('div', {
            children: [
              e.jsx('label', { className: 'block font-bold text-slate-300 mb-1', children: 'Commit Message:' }),
              e.jsx('input', {
                type: 'text',
                value: commitMsg,
                onChange: function(v) { setCommitMsg(v.target.value); },
                placeholder: 'Update Nursing Officer App codebase',
                className: 'w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500'
              })
            ]
          }),

          e.jsxs('div', {
            className: 'flex flex-wrap items-center gap-3 pt-1',
            children: [
              e.jsx('button', {
                type: 'button',
                onClick: handleDeployPush,
                disabled: deploying,
                className: 'px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white rounded-xl font-extrabold shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50',
                children: deploying ? (lang === 'mr' ? '🚀 GitHub वर अपलोड होत आहे...' : '🚀 Pushing to GitHub...') : (lang === 'mr' ? '🚀 १-क्लिक कोड GitHub वर अपलोड करा (Push Code)' : '🚀 Push Code to GitHub')
              }),
              e.jsx('button', {
                type: 'button',
                onClick: handlePullLatest,
                disabled: pulling,
                className: 'px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50',
                children: pulling ? (lang === 'mr' ? '🔄 Pull होत आहे...' : '🔄 Pulling...') : (lang === 'mr' ? '🔄 GitHub वरून नवीन कोड घ्या (Pull)' : '🔄 Pull from GitHub')
              })
            ]
          }),

          logs.length > 0 && e.jsxs('div', {
            className: 'bg-black/80 rounded-xl p-3 border border-slate-800 space-y-1 font-mono text-[11px] max-h-48 overflow-y-auto',
            children: logs.map(function(l, i) {
              return e.jsx('div', { key: i, className: l.includes('❌') ? 'text-rose-400' : l.includes('✅') || l.includes('🎉') ? 'text-emerald-400' : 'text-slate-300', children: l });
            })
          })
        ]
      })
    ]
  });
}
`;

// Insert AdminGithubDeployHub definition
content = githubHubCode + '\n' + content;

// Also render AdminGithubDeployHub in Settings tab right after AdminSupabaseSyncHub
const renderTarget = 'e.jsx(AdminSupabaseSyncHub,{lang:s,showToast:Rt}),';
if (!content.includes(renderTarget)) {
  console.error("renderTarget not found!");
  process.exit(1);
}

content = content.replace(renderTarget, renderTarget + 'e.jsx(AdminGithubDeployHub,{lang:s,showToast:Rt}),');

// Verify AST with Acorn
try {
  acorn.parse(content, { ecmaVersion: 2022, sourceType: 'module' });
  console.log("ACORN AST VALID! SUCCESS!");
  fs.writeFileSync('test_github_hub_bundle.js', content, 'utf8');
} catch (err) {
  console.error("ACORN ERROR:", err.message, "line:", err.loc ? err.loc.line : "?");
  process.exit(1);
}
