import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";



const firebaseConfig = {
  apiKey: "AIzaSyCR8rNHZ-0Pa0e1-os-pR1ilOSC9rHqTU4",
  authDomain: "v-stream-d25df.firebaseapp.com",
  databaseURL: "https://v-stream-d25df-default-rtdb.firebaseio.com",
  projectId: "v-stream-d25df",
  storageBucket: "v-stream-d25df.appspot.com",
  messagingSenderId: "703340028082",
  appId: "1:703340028082:web:450e37c0d346ef9ce9e9ab"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Global Functions
function showPlacementCode(code) {
  const decodedCode = decodeURIComponent(code);
  document.getElementById("placementCodeText").value = decodedCode;
  document.getElementById("codeModal").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("codeModalContent").classList.remove("scale-95", "opacity-0");
  }, 10);
}

function copyPlacementCode() {
  const codeText = document.getElementById("placementCodeText");
  codeText.select();
  codeText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(codeText.value).then(() => {
    const copyBtn = document.querySelector('[onclick="copyPlacementCode()"]');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 2000);
  });
}

function closeCodeModal() {
  document.getElementById("codeModalContent").classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    document.getElementById("codeModal").classList.add("hidden");
  }, 300);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateCTR(clicks, impressions) {
  return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : 0;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function getAdTypeIcon(type) {
  const icons = {
    'banner': 'fa-rectangle-ad',
    'inpage-push': 'fa-bullhorn',
    'popunder': 'fa-window-restore',
    'native': 'fa-newspaper',
    'direct-link': 'fa-link'
  };
  return icons[type.toLowerCase()] || 'fa-ad';
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-5 right-5 px-5 py-3 rounded-lg shadow-lg text-white flex items-center gap-2 z-50 animate-fade-in ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// payment code 



document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  const updateTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (darkModeToggle) darkModeToggle.checked = isDark;
  };
  
  themeToggle?.addEventListener('click', () => {
    const isDark = !document.documentElement.classList.contains('dark');
    updateTheme(isDark);
  });
  
  darkModeToggle?.addEventListener('change', (e) => {
    updateTheme(e.target.checked);
  });
  
  // Initial theme check
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
  updateTheme(initialTheme);


  // View Switching
document.getElementById('adsunit')?.addEventListener('click', () => {
  document.getElementById('adss').style.display = '';
  document.getElementById('dashboardd').style.display = 'none';
  document.getElementById('settingsContainer').style.display = 'none';
  document.getElementById('paymentsContainer').style.display = 'none';
});

document.getElementById('dashboards')?.addEventListener('click', () => {
  document.getElementById('adss').style.display = 'none';
  document.getElementById('dashboardd').style.display = '';
  document.getElementById('settingsContainer').style.display = 'none';
  document.getElementById('paymentsContainer').style.display = 'none';
});

document.getElementById('setting')?.addEventListener('click', () => {
  document.getElementById('adss').style.display = 'none';
  document.getElementById('dashboardd').style.display = 'none';
  document.getElementById('settingsContainer').style.display = '';
  document.getElementById('paymentsContainer').style.display = 'none';
});

document.getElementById('payments')?.addEventListener('click', () => {
  document.getElementById('adss').style.display = 'none';
  document.getElementById('dashboardd').style.display = 'none';
  document.getElementById('settingsContainer').style.display = 'none';
  document.getElementById('paymentsContainer').style.display = '';
  loadPaymentsData();
});

  // Modal Handling
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  
  document.getElementById('openModalBtn')?.addEventListener('click', () => {
    modal.style.display = 'flex';
    setTimeout(() => modalContent.classList.remove("scale-95", "opacity-0"), 10);
  });

  const closeModal = () => {
    modalContent.classList.add("scale-95", "opacity-0");
    setTimeout(() => modal.style.display = 'none', 300);
  };

  document.getElementById('cancelModalBtn')?.addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn2')?.addEventListener('click', closeModal);

  // Ad Type Selection
  document.querySelectorAll('.ad-type-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.ad-type-btn').forEach(btn => {
        btn.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-gray-700');
      });
      button.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-gray-700');
      document.getElementById('adType').value = button.dataset.type;
    });
  });

  // Create Ad Form Submission
  document.getElementById('createAdBtn')?.addEventListener('click', createAd);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User authenticated:", user.uid);
    document.getElementById('userName').textContent = user.displayName || user.email.split('@')[0];
    document.getElementById('userEmail').textContent = user.email;
    updateGreeting(user);
    loadAdsData(user);
  } else {
    console.log("No user authenticated");
    document.getElementById("requestsTable").innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center">
          <p class="text-gray-500 dark:text-gray-400">Please log in to see your dashboard.</p>
          <button class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg">Login</button>
        </td>
      </tr>`;
  }
});

function updateGreeting(user) {
  const hour = new Date().getHours();
  let greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  document.getElementById('greeting').textContent = greeting;
  document.getElementById('username').textContent = user.displayName || user.email.split('@')[0];
}

function loadAdsData(user) {
  const allAdsRef = ref(db, "boostify/adUnits");
  
  document.getElementById("requestsTable").innerHTML = `
    <tr>
      <td colspan="5" class="py-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </td>
    </tr>`;
  
  onValue(allAdsRef, (snapshot) => {
    const data = snapshot.val() || {};
    const allAds = Object.values(data)
      .filter(ad => ad.publisherId === user.uid)
      .sort((a, b) => b.createdAt - a.createdAt);

    renderAds(allAds);
    updateDashboardTotals(allAds);
    renderDashboardTable(allAds.slice(0, 10));
    initializeChart(allAds);
  }, (error) => {
    console.error("Error loading ads data:", error);
    showToast("Failed to load ads data. Please try again.", "error");
  });
}

function renderAds(ads, filter = "") {
  const container = document.getElementById('adsContainer');
  const loadingContainer = document.getElementById('adsLoading');
  
  loadingContainer?.classList.add('hidden');
  container?.classList.remove('hidden');
  container.innerHTML = '';

  const filteredAds = ads.filter(ad => 
    ad.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredAds.length === 0) {
    container.innerHTML = `
      <div class="col-span-3 flex flex-col items-center justify-center py-12 text-center">
        <i class="fas fa-ad text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400">No ads found</h3>
        <button id="openModalBtn2" class="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
          Create Ad Unit
        </button>
      </div>`;
    
    document.getElementById('openModalBtn2')?.addEventListener('click', () => {
      document.getElementById('modal').style.display = 'flex';
      setTimeout(() => {
        document.getElementById('modalContent').classList.remove("scale-95", "opacity-0");
      }, 10);
    });
    return;
  }

  filteredAds.forEach(ad => {
    const statusColor = ad.status === "Approved" ? "bg-green-500" :
                      ad.status === "Pending" ? "bg-yellow-500" : "bg-red-500";
    const statusIcon = ad.status === "Approved" ? "fa-check-circle" :
                      ad.status === "Pending" ? "fa-clock" : "fa-exclamation-circle";
    
    container.innerHTML += `
      <div class="border dark:border-gray-700 rounded-xl p-5 shadow hover:shadow-lg transition-all bg-white dark:bg-gray-800 animate-fade-in">
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-bold text-lg text-gray-800 dark:text-white truncate">${ad.name}</h3>
          <span class="px-2.5 py-1 text-xs rounded-full ${statusColor} text-white flex items-center gap-1">
            <i class="fas ${statusIcon} text-xs"></i>
            <span>${ad.status}</span>
          </span>
        </div>
        <span class="inline-block text-sm mb-4 text-primary-600 dark:text-primary-400 font-medium">
          <i class="fas ${getAdTypeIcon(ad.type)} mr-1"></i>
          ${ad.type}
        </span>
        <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-5">
          <div class="flex justify-between">
            <span>Earnings:</span>
            <span class="font-semibold">$${(ad.earnings || 0).toFixed(2)}</span>
          </div>
          <div class="flex justify-between">
            <span>Impressions:</span>
            <span>${formatNumber(ad.impressions || 0)}</span>
          </div>
          <div class="flex justify-between">
            <span>Clicks:</span>
            <span>${formatNumber(ad.clicks || 0)}</span>
          </div>
          <div class="flex justify-between">
            <span>CTR:</span>
            <span>${calculateCTR(ad.clicks || 0, ad.impressions || 0)}%</span>
          </div>
        </div>
         <button class="placement-btn w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            data-code="${encodeURIComponent(ad.placementCode || '')}">
      <i class="fas fa-code"></i>
      <span>Get Placement Code</span>
    </button>
      </div>`;
  });

  document.getElementById('searchAd')?.addEventListener('input', e => renderAds(ads, e.target.value));
  
container.querySelectorAll('.placement-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showPlacementCode(btn.dataset.code);
  });
});
}



function updateDashboardTotals(ads) {
  const totalEarnings = ads.reduce((sum, ad) => sum + (ad.earnings || 0), 0);
  const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);

  const ecpmValues = ads.filter(ad => ad.ecpm !== undefined).map(ad => ad.ecpm);
  const avgEcpm = ecpmValues.length > 0 ? 
                 (ecpmValues.reduce((sum, val) => sum + val, 0) / ecpmValues.length) : 0;

  if (document.getElementById('earnings')) {
    document.getElementById('earnings').textContent = `$${totalEarnings.toFixed(2)}`;
  }
  if (document.getElementById('impressions')) {
    document.getElementById('impressions').textContent = totalImpressions;
  }
  if (document.getElementById('clicks')) {
    document.getElementById('clicks').textContent = totalClicks;
  }
  if (document.getElementById('ecpm')) {
    document.getElementById('ecpm').textContent = `$${avgEcpm.toFixed(2)}`;
  }
}


function renderDashboardTable(ads) {
  const dashboardTable = document.getElementById("requestsTable");
  if (!dashboardTable) return;

  if (!ads || ads.length === 0) {
    dashboardTable.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center">
          <i class="fas fa-ad text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
          <p class="text-gray-500 dark:text-gray-400">No ads created yet</p>
          <button id="openModalBtn3" class="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
            Create Your First Ad
          </button>
        </td>
      </tr>`;
    
    document.getElementById('openModalBtn3')?.addEventListener('click', () => {
      document.getElementById('modal').style.display = 'flex';
      setTimeout(() => {
        document.getElementById('modalContent').classList.remove("scale-95", "opacity-0");
      }, 10);
    });
    return;
  }
  
  dashboardTable.innerHTML = ads.map(ad => {
    const statusClass = ad.status === "Approved" ? 'text-green-600 dark:text-green-400' : 
                       'text-yellow-600 dark:text-yellow-400';
    const statusIcon = ad.status === "Approved" ? 'fa-check-circle' : 
                      ad.status === "Pending" ? 'fa-clock' : 'fa-exclamation-circle';
    
    return `
      <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <td class="py-3 px-4 text-gray-800 dark:text-gray-200">${ad.name}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400">
            <i class="fas ${getAdTypeIcon(ad.type)}"></i>
            <span>${ad.type}</span>
          </span>
        </td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1 ${statusClass} font-medium">
            <i class="fas ${statusIcon}"></i>
            <span>${ad.status}</span>
          </span>
        </td>
        <td class="py-3 px-4 text-gray-500 dark:text-gray-400">${formatDate(ad.createdAt)}</td>
        <td class="py-3 px-4">
          <button onclick="showPlacementCode('${encodeURIComponent(ad.placementCode || '')}')" 
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
            <i class="fas fa-code"></i>
          </button>
        </td>
      </tr>`;
  }).join('');
}

function initializeChart(ads) {
  const chartCanvas = document.getElementById('statsChart');
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');

  // Destroy previous chart if it exists
  if (window.statsChart instanceof Chart) {
    window.statsChart.destroy();
  }

  window.statsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ads.map(ad => new Date(ad.createdAt).toLocaleDateString()),
      datasets: [
        {
          label: 'Impressions',
          data: ads.map(ad => ad.impressions || 0),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Clicks',
          data: ads.map(ad => ad.clicks || 0),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Earnings ($)',
          data: ads.map(ad => ad.earnings || 0),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function groupDataByDay(ads) {
  const result = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Default labels
    impressions: [0, 0, 0, 0, 0, 0, 0],
    clicks: [0, 0, 0, 0, 0, 0, 0],
    earnings: [0, 0, 0, 0, 0, 0, 0]
  };

  if (!ads || ads.length === 0) {
    return result;
  }

  // Get current date and calculate last 7 days
  const now = new Date();
  const daysAgo = [...Array(7)].map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  // Aggregate data
  ads.forEach(ad => {
    const adDate = new Date(ad.createdAt).toISOString().split('T')[0];
    const dayIndex = daysAgo.indexOf(adDate);
    
    if (dayIndex !== -1) {
      result.impressions[dayIndex] += ad.impressions || 0;
      result.clicks[dayIndex] += ad.clicks || 0;
      result.earnings[dayIndex] += ad.earnings || 0;
    }
  });

  return result;
}

// Add this to your existing JavaScript code

// Payment method toggle
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'paypal') {
      document.getElementById('paypalFields').classList.remove('hidden');
      document.getElementById('bankFields').classList.add('hidden');
    } else {
      document.getElementById('paypalFields').classList.add('hidden');
      document.getElementById('bankFields').classList.remove('hidden');
    }
  });
});

// Save payment settings
document.getElementById('savePaymentBtn')?.addEventListener('click', savePaymentSettings);

function savePaymentSettings() {
  const user = auth.currentUser;
  if (!user) {
    showToast('Please log in to save payment settings', 'error');
    return;
  }

  const btn = document.getElementById('savePaymentBtn');
  const spinner = document.getElementById('paymentSpinner');
  
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const payoutThreshold = parseFloat(document.getElementById('payoutThreshold').value);
  const autoPayout = document.getElementById('autoPayout').checked;
  
  if (payoutThreshold < 100) {
    showToast('Minimum payout threshold is $100', 'error');
    return;
  }

  let paymentDetails = {};
  if (paymentMethod === 'paypal') {
    const paypalEmail = document.getElementById('paypalEmail').value.trim();
    if (!paypalEmail) {
      showToast('Please enter your PayPal email', 'error');
      return;
    }
    paymentDetails = { paypalEmail };
  } else {
    const bankAccountName = document.getElementById('bankAccountName').value.trim();
    const bankName = document.getElementById('bankName').value.trim();
    const bankAccountNumber = document.getElementById('bankAccountNumber').value.trim();
    const bankIban = document.getElementById('bankIban').value.trim();
    
    if (!bankAccountName || !bankName || !bankAccountNumber) {
      showToast('Please fill all required bank details', 'error');
      return;
    }
    
    paymentDetails = {
      bankAccountName,
      bankName,
      bankAccountNumber,
      bankIban
    };
  }

  btn.disabled = true;
  spinner.classList.remove('hidden');

  const updates = {
    paymentMethod,
    paymentDetails,
    payoutSettings: {
      threshold: payoutThreshold,
      autoPayout
    },
    updatedAt: Date.now()
  };

  const settingsRef = ref(db, `boostify/publisherSettings/${user.uid}`);
  set(settingsRef, updates, { merge: true })
    .then(() => {
      showToast('Payment settings saved successfully', 'success');
    })
    .catch(error => {
      console.error('Error saving payment settings:', error);
      showToast('Failed to save payment settings: ' + error.message, 'error');
    })
    .finally(() => {
      btn.disabled = false;
      spinner.classList.add('hidden');
    });
}

document.getElementById('saveProfileBtn').addEventListener('click', saveProfileSettings);

// Update profile settings to also update Firebase user display name
function saveProfileSettings() {
  const user = auth.currentUser;
  if (!user) {
    showToast('Please log in to save settings', 'error');
    return;
  }

  const btn = document.getElementById('saveProfileBtn');
  const spinner = document.getElementById('profileSpinner');
  const displayName = document.getElementById('displayName').value.trim();
  const timezone = document.getElementById('timezone').value;

  if (!displayName) {
    showToast('Please enter a display name', 'error');
    return;
  }

  btn.disabled = true;
  spinner.classList.remove('hidden');

  // Update Firebase Auth display name
  updateProfile(user, { displayName })
    .then(() => {
      // Save display name in publisher node
      return set(ref(db, `publisher/${user.uid}/fullname`), displayName);
    })
    .then(() => {
      // Save additional settings
      const updates = {
        displayName,
        timezone,
        updatedAt: Date.now()
      };
      return set(ref(db, `boostify/publisherSettings/${user.uid}`), updates);
    })
    .then(() => {
      showToast('Profile settings saved successfully', 'success');
      document.getElementById('userName').textContent = displayName;
      document.getElementById('username').textContent = displayName;
    })
    .catch(error => {
      console.error('Error saving settings:', error);
      showToast('Failed to save settings: ' + error.message, 'error');
    })
    .finally(() => {
      btn.disabled = false;
      spinner.classList.add('hidden');
    });
}


// Load payment settings
function loadSettings() {
  const user = auth.currentUser;
  if (!user) return;

  // Load profile info
  document.getElementById('displayName').value = user.displayName || '';
  document.getElementById('userEmailInput').value = user.email || '';

  // Load settings from Firebase
  const settingsRef = ref(db, `boostify/publisherSettings/${user.uid}`);
  onValue(settingsRef, (snapshot) => {
    const settings = snapshot.val() || {};
    
    // Timezone
    if (settings.timezone) {
      document.getElementById('timezone').value = settings.timezone;
    }
    
    // Notification preferences
    if (settings.notifications) {
      document.getElementById('emailNotifications').checked = settings.notifications.email || true;
      document.getElementById('paymentAlerts').checked = settings.notifications.payments || true;
      document.getElementById('performanceReports').checked = settings.notifications.reports || false;
    }
    
    // Payment settings
    if (settings.paymentMethod) {
      document.querySelector(`input[name="paymentMethod"][value="${settings.paymentMethod}"]`).checked = true;
      
      if (settings.paymentMethod === 'paypal') {
        document.getElementById('paypalFields').classList.remove('hidden');
        document.getElementById('bankFields').classList.add('hidden');
        if (settings.paymentDetails?.paypalEmail) {
          document.getElementById('paypalEmail').value = settings.paymentDetails.paypalEmail;
        }
      } else {
        document.getElementById('paypalFields').classList.add('hidden');
        document.getElementById('bankFields').classList.remove('hidden');
        if (settings.paymentDetails) {
          document.getElementById('bankAccountName').value = settings.paymentDetails.bankAccountName || '';
          document.getElementById('bankName').value = settings.paymentDetails.bankName || '';
          document.getElementById('bankAccountNumber').value = settings.paymentDetails.bankAccountNumber || '';
          document.getElementById('bankIban').value = settings.paymentDetails.bankIban || '';
        }
      }
    }
    
    // Payout settings
    if (settings.payoutSettings) {
      document.getElementById('payoutThreshold').value = settings.payoutSettings.threshold || 100;
      document.getElementById('autoPayout').checked = settings.payoutSettings.autoPayout || false;
    }
  });
}

function createAd() {
  const adName = document.getElementById('adName').value.trim();
  const adType = document.getElementById('adType').value;
  
  if (!adName || !adType) {
    showToast('Please provide a name and select an ad type.', 'error');
    return;
  }
  
  const user = auth.currentUser;
  if (!user) {
    showToast('Please log in to create an ad.', 'error');
    return;
  }
  
  const createBtn = document.getElementById('createAdBtn');
  const createBtnText = document.getElementById('createBtnText');
  const createSpinner = document.getElementById('createSpinner');
  
  createBtn.disabled = true;
  createBtnText.textContent = 'Creating...';
  createSpinner.classList.remove('hidden');
  
  const adData = {
    name: adName,
    type: adType,
    status: "Pending",
    createdAt: Date.now(),
    publisherId: user.uid,
    publisherEmail: user.email,
    placementCode: generatePlacementCode(adType),
    impressions: 0,
    clicks: 0,
    ecpm: 0,
    earnings: 0
  };
  
  const adRef = push(ref(db, 'boostify/adUnits'));
  set(adRef, adData)
    .then(() => {
      showToast("Ad unit created successfully!", "success");
      document.getElementById('modalContent').classList.add("scale-95", "opacity-0");
      setTimeout(() => {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('adName').value = '';
        document.getElementById('adType').value = '';
        createBtn.disabled = false;
        createBtnText.textContent = 'Create Ad';
        createSpinner.classList.add('hidden');
      }, 300);
    })
    .catch(error => {
      console.error("Error creating ad:", error);
      showToast("Error creating ad: " + error.message, "error");
      createBtn.disabled = false;
      createBtnText.textContent = 'Create Ad';
      createSpinner.classList.add('hidden');
    });
}

function generatePlacementCode(adType) {
  const typeMap = {
    'banner': 'banner-ad',
    'inpage-push': 'inpage-push',
    'popunder': 'popunder-ad',
    'native': 'native-ad',
    'direct-link': 'direct-link'
  };
  
  const adTypeClass = typeMap[adType.toLowerCase()] || 'boostify-ad';
  
  return `<!-- Boostify ${adType} Ad Unit -->
<div class="${adTypeClass}" data-ad-unit-id="YOUR_AD_UNIT_ID">
  <!-- Ad content will be loaded here -->
</div>
<script src="https://cdn.boostifyads.com/loader.js"></script>`;
}


// Add to your view switching logic
document.getElementById('payments')?.addEventListener('click', () => {
  document.getElementById('adss').style.display = 'none';
  document.getElementById('dashboardd').style.display = 'none';
  document.getElementById('settingsContainer').style.display = 'none';
  document.getElementById('paymentsContainer').style.display = '';
  loadPaymentsData();
});

// Payment functions
function loadPaymentsData() {
  const user = auth.currentUser;
  if (!user) return;

  // Load balance and payments
  const balanceRef = ref(db, `boostify/publisherBalances/${user.uid}`);
  const paymentsRef = ref(db, `boostify/payments/${user.uid}`);
  
  onValue(balanceRef, (snapshot) => {
    const balanceData = snapshot.val() || { available: 0, pending: 0 };
    updateBalanceUI(balanceData);
  });
  
  onValue(paymentsRef, (snapshot) => {
    const paymentsData = snapshot.val() || {};
    renderPaymentsTable(paymentsData);
  });
}

function updateBalanceUI(balanceData) {
  const available = balanceData.available || 0;
  const pending = balanceData.pending || 0;
  
  document.getElementById('availableBalance').textContent = `$${available.toFixed(2)}`;
  document.getElementById('pendingWithdrawal').textContent = `$${pending.toFixed(2)}`;
  
  // Update withdraw button state
  const withdrawBtn = document.getElementById('withdrawBtn');
  const withdrawMessage = document.getElementById('withdrawMessage');
  
  if (available >= 100) {
    withdrawBtn.disabled = false;
    withdrawBtn.classList.remove('bg-gray-400', 'hover:bg-gray-400');
    withdrawBtn.classList.add('bg-green-600', 'hover:bg-green-700');
    withdrawMessage.textContent = 'You can request a withdrawal';
    withdrawMessage.className = 'text-sm mt-3 text-green-600 dark:text-green-400';
  } else {
    withdrawBtn.disabled = true;
    withdrawBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
    withdrawBtn.classList.add('bg-gray-400', 'hover:bg-gray-400');
    withdrawMessage.textContent = `Minimum withdrawal amount is $100 (current balance: $${available.toFixed(2)})`;
    withdrawMessage.className = 'text-sm mt-3 text-red-600 dark:text-red-400';
  }
}

function renderPaymentsTable(paymentsData) {
  const paymentsTable = document.getElementById('paymentsTable');
  const paymentsArray = Object.values(paymentsData).sort((a, b) => b.timestamp - a.timestamp);
  
  if (paymentsArray.length === 0) {
    paymentsTable.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center">
          <i class="fas fa-wallet text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
          <p class="text-gray-500 dark:text-gray-400">No payments yet</p>
        </td>
      </tr>`;
    return;
  }
  
  paymentsTable.innerHTML = paymentsArray.map(payment => {
    const statusClass = payment.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                      payment.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400';
    const statusIcon = payment.status === 'completed' ? 'fa-check-circle' :
                     payment.status === 'pending' ? 'fa-clock' : 'fa-exclamation-circle';
    
    return `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td class="py-3 px-4 text-gray-800 dark:text-gray-200">${formatDate(payment.timestamp)}</td>
        <td class="py-3 px-4 font-medium">$${payment.amount.toFixed(2)}</td>
        <td class="py-3 px-4">${payment.method || 'N/A'}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1 ${statusClass}">
            <i class="fas ${statusIcon}"></i>
            <span>${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
          </span>
        </td>
        <td class="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono text-xs">${payment.transactionId || 'N/A'}</td>
      </tr>`;
  }).join('');
  
  // Add search functionality
  document.getElementById('searchPayments')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = paymentsTable.querySelectorAll('tr');
    
    rows.forEach(row => {
      if (row.cells.length === 1) return; // Skip loading row
      
      const text = Array.from(row.cells).map(cell => cell.textContent.toLowerCase()).join(' ');
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
}

// Withdrawal functions
document.getElementById('withdrawBtn')?.addEventListener('click', openWithdrawModal);
document.getElementById('confirmWithdrawBtn')?.addEventListener('click', processWithdrawal);

function openWithdrawModal() {
  const user = auth.currentUser;
  if (!user) return;

  // Get current balance
  const balanceRef = ref(db, `boostify/publisherBalances/${user.uid}/available`);
  onValue(balanceRef, (snapshot) => {
    const availableBalance = snapshot.val() || 0;
    document.getElementById('availableBalanceInput').value = `$${availableBalance.toFixed(2)}`;
    document.getElementById('withdrawAmount').value = availableBalance >= 100 ? availableBalance.toFixed(2) : '';
    document.getElementById('withdrawAmount').max = availableBalance;
    
    // Load payment method info
    const settingsRef = ref(db, `boostify/publisherSettings/${user.uid}`);
    onValue(settingsRef, (settingsSnapshot) => {
      const settings = settingsSnapshot.val() || {};
      let method = 'PayPal';
      let account = 'Not configured';
      
      if (settings.paymentMethod === 'paypal' && settings.paymentDetails?.paypalEmail) {
        method = 'PayPal';
        account = settings.paymentDetails.paypalEmail;
      } else if (settings.paymentMethod === 'bank' && settings.paymentDetails?.bankAccountName) {
        method = 'Bank Transfer';
        account = `${settings.paymentDetails.bankAccountName} (${settings.paymentDetails.bankName})`;
      }
      
      document.getElementById('selectedMethod').textContent = method;
      document.getElementById('paymentAccount').textContent = account;
    });
  });
  
  document.getElementById('withdrawModal').classList.remove('hidden');
}

function closeWithdrawModal() {
  document.getElementById('withdrawModal').classList.add('hidden');
}

function processWithdrawal() {
  const user = auth.currentUser;
  if (!user) {
    showToast('Please log in to request withdrawal', 'error');
    return;
  }

  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  if (isNaN(amount)) {
    showToast('Please enter a valid amount', 'error');
    return;
  }

  if (amount < 100) {
    showToast('Minimum withdrawal amount is $100', 'error');
    return;
  }

  const btn = document.getElementById('confirmWithdrawBtn');
  const spinner = document.getElementById('withdrawSpinner');
  
  btn.disabled = true;
  spinner.classList.remove('hidden');

  // Check available balance first
  const balanceRef = ref(db, `boostify/publisherBalances/${user.uid}`);
  get(balanceRef).then((snapshot) => {
    const balanceData = snapshot.val() || { available: 0, pending: 0 };
    
    if (amount > balanceData.available) {
      throw new Error('Insufficient balance for this withdrawal');
    }

    // Create withdrawal request
    const withdrawalId = push(child(ref(db), 'boostify/withdrawals')).key;
    const paymentId = push(child(ref(db), `boostify/payments/${user.uid}`)).key;
    
    const updates = {};
    updates[`boostify/withdrawals/${withdrawalId}`] = {
      publisherId: user.uid,
      publisherEmail: user.email,
      amount,
      status: 'pending',
      timestamp: Date.now(),
      method: document.getElementById('selectedMethod').textContent
    };
    
    updates[`boostify/payments/${user.uid}/${paymentId}`] = {
      amount,
      status: 'pending',
      timestamp: Date.now(),
      method: document.getElementById('selectedMethod').textContent,
      transactionId: `WDR-${Date.now()}`
    };
    
    // Update balances
    updates[`boostify/publisherBalances/${user.uid}/available`] = balanceData.available - amount;
    updates[`boostify/publisherBalances/${user.uid}/pending`] = (balanceData.pending || 0) + amount;
    
    return update(ref(db), updates);
  })
  .then(() => {
    showToast('Withdrawal request submitted successfully', 'success');
    closeWithdrawModal();
  })
  .catch(error => {
    console.error('Withdrawal error:', error);
    showToast('Withdrawal failed: ' + error.message, 'error');
  })
  .finally(() => {
    btn.disabled = false;
    spinner.classList.add('hidden');
  });
}

// Add to your existing window exposure
window.closeWithdrawModal = closeWithdrawModal;

// Expose functions to global scope
window.showPlacementCode = showPlacementCode;
window.copyPlacementCode = copyPlacementCode;
window.closeCodeModal = closeCodeModal;    