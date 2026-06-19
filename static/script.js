const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const previewContainer = document.getElementById("previewContainer");
const imagePreview = document.getElementById("imagePreview");
const removeBtn = document.getElementById("removeBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const resultSection = document.getElementById("resultSection");
const errorToast = document.getElementById("errorToast");

const openCameraBtn = document.getElementById("openCameraBtn");
const cameraPreviewBox = document.getElementById("cameraPreviewBox");
const cameraVideo = document.getElementById("cameraVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const captureBtn = document.getElementById("captureBtn");
const closeCameraBtn = document.getElementById("closeCameraBtn");

const chatToggle = document.getElementById("chatToggle");
const chatbox = document.getElementById("chatbox");
const closeChatBtn = document.getElementById("closeChatBtn");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChatBtn = document.getElementById("sendChatBtn");
const quickBtns = document.querySelectorAll(".quick-btn");

const languageScreen = document.getElementById("languageScreen");
const appWrapper = document.getElementById("appWrapper");
const chooseTamil = document.getElementById("chooseTamil");
const chooseEnglish = document.getElementById("chooseEnglish");
const changeLanguageBtn = document.getElementById("changeLanguageBtn");
const speakResultBtn = document.getElementById("speakResultBtn");

let selectedFile = null;
let cameraStream = null;
let currentLanguage = localStorage.getItem("uzhavan_language") || null;
let latestResultData = null;

const translations = {
  en: {
    languageTitle: "Choose Language",
    languageSubtitle: "Select your preferred language to continue",
    navDetect: "Detect Disease",
    navAbout: "About",
    changeLanguageBtn: "Change Language",
    heroTag: "Smart Farming Assistant",
    heroTitle: "Detect Paddy Leaf Diseases with AI",
    heroSubtitle: "Fast diagnosis, fertilizer advice, organic solutions, and prevention tips",
    heroDesc: "Upload a paddy leaf image and get instant AI-based disease analysis built for farmers and agriculture innovation.",
    heroButton: "Start Detection",
    uploadTitle: "Upload Paddy Leaf Image",
    uploadSubtitle: "Supports JPG, PNG, JPEG formats",
    dropTitle: "Drop your image here",
    dropText: "Drag & drop your leaf image or choose an option below",
    browseBtnText: "Browse Image",
    openCameraBtn: "Open Camera",
    captureBtn: "Capture Photo",
    closeCameraBtn: "Close Camera",
    removeBtn: "✕ Remove Image",
    analyzeBtn: "Analyze Leaf",
    confidenceLabel: "Confidence",
    descLabel: "Description",
    fertLabel: "Fertilizer",
    pestLabel: "Pesticide / Treatment",
    organicLabel: "Organic Solution",
    prevLabel: "Prevention Tips",
    resetBtn: "Analyze Another Image",
    aboutTitle: "Why Uzhavan AI?",
    aboutSubtitle: "Made for smart agriculture, farmer support, and quick field-level decisions",
    aboutAiTitle: "AI Detection",
    aboutAiText: "Detect paddy leaf diseases using trained deep learning image analysis.",
    aboutSmartTitle: "Smart Suggestions",
    aboutSmartText: "Get fertilizer, pesticide, and organic remedy recommendations instantly.",
    aboutMobileTitle: "Field Ready",
    aboutMobileText: "Use it from laptop or mobile while checking crops directly in the field.",
    footerText: "🌾 Uzhavan AI — Empowering farmers with technology",
    chatTitle: "🌾 Uzhavan AI Assistant",
    chatSubtitle: "Farmer help chat",
    chatPlaceholder: "Type your question...",
    chatSend: "Send",
    quick1: "What is brown spot?",
    quick2: "What spray for leaf blight?",
    quick3: "Tell organic solution",
    quick4: "Need prevention tips",
    welcomeChat: "Hello 👋 I am Uzhavan AI assistant. Ask me about disease, fertilizer, pesticide, organic solution, or prevention.",
    invalidImage: "Please upload a valid image file.",
    cameraError: "Camera could not be opened. Please allow browser permission.",
    captureError: "Camera image capture failed.",
    connectError: "Could not connect to the server. Make sure Flask is running.",
    nonLeafError: "Please upload a clear paddy leaf image only.",
    speakBtn: "🔊 Speak"
  },
  ta: {
    languageTitle: "மொழியை தேர்வு செய்யவும்",
    languageSubtitle: "தொடர உங்கள் விருப்ப மொழியை தேர்வு செய்யவும்",
    navDetect: "நோய் கண்டறிதல்",
    navAbout: "பற்றி",
    changeLanguageBtn: "மொழி மாற்று",
    heroTag: "செயற்கை நுண்ணறிவு விவசாய உதவி",
    heroTitle: "நெல் இலை நோய்களை AI மூலம் கண்டறியுங்கள்",
    heroSubtitle: "வேகமான முடிவு, உர பரிந்துரை, இயற்கை தீர்வு, தடுப்பு குறிப்புகள்",
    heroDesc: "நெல் இலை படத்தை பதிவேற்றி உடனடி AI அடிப்படையிலான நோய் பகுப்பாய்வை பெறுங்கள்.",
    heroButton: "தொடங்கு",
    uploadTitle: "நெல் இலை படத்தை பதிவேற்று",
    uploadSubtitle: "JPG, PNG, JPEG வடிவங்கள் ஆதரவு",
    dropTitle: "உங்கள் படத்தை இங்கே விடுங்கள்",
    dropText: "இலையின் படத்தை இழுத்து விடவும் அல்லது கீழே உள்ள விருப்பத்தை தேர்வு செய்யவும்",
    browseBtnText: "படத்தை தேர்வு செய்",
    openCameraBtn: "கேமரா திற",
    captureBtn: "படம் எடு",
    closeCameraBtn: "கேமரா மூடு",
    removeBtn: "✕ படத்தை நீக்கு",
    analyzeBtn: "இலையை ஆய்வு செய்",
    confidenceLabel: "நம்பிக்கை",
    descLabel: "விளக்கம்",
    fertLabel: "உரம்",
    pestLabel: "மருந்து / சிகிச்சை",
    organicLabel: "இயற்கை தீர்வு",
    prevLabel: "தடுப்பு குறிப்புகள்",
    resetBtn: "மற்றொரு படத்தை ஆய்வு செய்",
    aboutTitle: "ஏன் Uzhavan AI?",
    aboutSubtitle: "சாமர்த்தியமான விவசாயத்திற்கும் விவசாயி உதவிக்கும் உருவாக்கப்பட்டது",
    aboutAiTitle: "AI கண்டறிதல்",
    aboutAiText: "Deep learning மூலம் நெல் இலை நோய்களை கண்டறிகிறது.",
    aboutSmartTitle: "சாமர்த்தியமான பரிந்துரைகள்",
    aboutSmartText: "உரம், மருந்து, இயற்கை தீர்வு பரிந்துரைகள் உடனே கிடைக்கும்.",
    aboutMobileTitle: "வயல் பயன்பாடு",
    aboutMobileText: "லாப்டாப் அல்லது மொபைல் மூலம் வயலில் இருந்தபடியே பயன்படுத்தலாம்.",
    footerText: "🌾 Uzhavan AI — தொழில்நுட்பத்தால் விவசாயிக்கு உதவி",
    chatTitle: "🌾 Uzhavan AI உதவியாளர்",
    chatSubtitle: "விவசாய உதவி உரையாடல்",
    chatPlaceholder: "உங்கள் கேள்வியை எழுதவும்...",
    chatSend: "அனுப்பு",
    quick1: "Brown spot என்றால் என்ன?",
    quick2: "Leaf blightக்கு என்ன spray?",
    quick3: "இயற்கை தீர்வு சொல்லு",
    quick4: "தடுப்பு குறிப்புகள் வேண்டும்",
    welcomeChat: "வணக்கம் 👋 நான் Uzhavan AI உதவியாளர். நோய், உரம், மருந்து, இயற்கை தீர்வு, தடுப்பு பற்றி கேளுங்கள்.",
    invalidImage: "சரியான படத்தை மட்டும் பதிவேற்றவும்.",
    cameraError: "கேமரா திறக்க முடியவில்லை. Browser permission அனுமதிக்கவும்.",
    captureError: "கேமரா படத்தை எடுக்க முடியவில்லை.",
    connectError: "Server-க்கு connect ஆகவில்லை. Flask ஓடுகிறதா பாருங்கள்.",
    nonLeafError: "தெளிவான நெல் இலை படத்தை மட்டும் பதிவேற்றவும்.",
    speakBtn: "🔊 ஒலி"
  }
};

const resultTranslations = {
  en: {
    "Bacterial Leaf Blight": "Bacterial Leaf Blight",
    "Brown Spot": "Brown Spot",
    "Leaf Smut": "Leaf Smut"
  },
  ta: {
    "Bacterial Leaf Blight": "பாக்டீரியா இலை உலர்ச்சி",
    "Brown Spot": "பழுப்பு புள்ளி நோய்",
    "Leaf Smut": "இலை ஸ்மட் நோய்"
  }
};

const diseaseInfoTamil = {
  "Bacterial Leaf Blight": {
    description: "இது ஒரு பாக்டீரியா நோய். நெல் இலைகளில் மஞ்சள் முதல் பழுப்பு வரை நீளமான கோடுகள் தோன்றும்.",
    fertilizer: "சமநிலை NPK உரம் பயன்படுத்தவும். அதிக நைட்ரஜன் விட வேண்டாம்.",
    pesticide: "விவசாய ஆலோசனைப்படி Streptocycline மற்றும் Copper Oxychloride பயன்படுத்தலாம்.",
    organic_solution: "வேப்பெண்ணெய் தெளிப்பு அல்லது Pseudomonas bio-control உதவும்.",
    prevention: "அதிக நீர் தேக்கம் தவிர்க்கவும், பாதிக்கப்பட்ட இலைகளை நீக்கவும், எதிர்ப்பு சக்தி உள்ள வகைகளை பயன்படுத்தவும்."
  },
  "Brown Spot": {
    description: "இது ஒரு பூஞ்சை நோய். இலைகளில் வட்டமான அல்லது நீளமான பழுப்பு புள்ளிகள் காணப்படும்.",
    fertilizer: "பொட்டாசியம் போதுமான அளவில் உள்ள சமநிலை உரம் பயன்படுத்தவும்.",
    pesticide: "உள்ளூர் ஆலோசனைப்படி Mancozeb போன்ற பூஞ்சை மருந்து பயன்படுத்தலாம்.",
    organic_solution: "வேப்பச்சாறு அல்லது வேப்பெண்ணெய் தெளிக்கலாம்.",
    prevention: "வயல் சுத்தமாக வைத்துக்கொள்ளவும், ஊட்டச்சத்து குறைபாடு வராமல் கவனிக்கவும்."
  },
  "Leaf Smut": {
    description: "இது ஒரு பூஞ்சை நோய். இலைகளில் கரும்பட்டைகள் அல்லது smut போன்ற அறிகுறிகள் தோன்றும்.",
    fertilizer: "சமநிலை ஊட்டச்சத்து கொடுத்து தாவர ஆரோக்கியத்தை மேம்படுத்தவும்.",
    pesticide: "விவசாய ஆலோசனைப்படி Carbendazim போன்ற மருந்து பயன்படுத்தலாம்.",
    organic_solution: "வேப்ப அடிப்படையிலான இயற்கை சிகிச்சை உதவும்.",
    prevention: "பாதிக்கப்பட்ட இலைகளை அகற்றவும், அதிக ஈரப்பதத்தை குறைக்கவும்."
  }
};

function initLanguage() {
  if (currentLanguage) {
    languageScreen.style.display = "none";
    appWrapper.style.display = "block";
    applyLanguage(currentLanguage);
  } else {
    languageScreen.style.display = "flex";
    appWrapper.style.display = "none";
  }
}

chooseTamil.addEventListener("click", () => {
  currentLanguage = "ta";
  localStorage.setItem("uzhavan_language", "ta");
  languageScreen.style.display = "none";
  appWrapper.style.display = "block";
  applyLanguage("ta");
});

chooseEnglish.addEventListener("click", () => {
  currentLanguage = "en";
  localStorage.setItem("uzhavan_language", "en");
  languageScreen.style.display = "none";
  appWrapper.style.display = "block";
  applyLanguage("en");
});

changeLanguageBtn.addEventListener("click", () => {
  localStorage.removeItem("uzhavan_language");
  currentLanguage = null;
  appWrapper.style.display = "none";
  languageScreen.style.display = "flex";
  chatbox.style.display = "none";
});

function applyLanguage(lang) {
  const t = translations[lang];

  document.getElementById("languageTitle").textContent = t.languageTitle;
  document.getElementById("languageSubtitle").textContent = t.languageSubtitle;
  document.getElementById("navDetect").textContent = t.navDetect;
  document.getElementById("navAbout").textContent = t.navAbout;
  document.getElementById("changeLanguageBtn").textContent = t.changeLanguageBtn;
  document.getElementById("heroTag").textContent = t.heroTag;
  document.getElementById("heroTitle").textContent = t.heroTitle;
  document.getElementById("heroSubtitle").textContent = t.heroSubtitle;
  document.getElementById("heroDesc").textContent = t.heroDesc;
  document.getElementById("heroButton").textContent = t.heroButton;
  document.getElementById("uploadTitle").textContent = t.uploadTitle;
  document.getElementById("uploadSubtitle").textContent = t.uploadSubtitle;
  document.getElementById("dropTitle").textContent = t.dropTitle;
  document.getElementById("dropText").textContent = t.dropText;
  document.getElementById("browseBtnText").textContent = t.browseBtnText;
  document.getElementById("openCameraBtn").textContent = t.openCameraBtn;
  document.getElementById("captureBtn").textContent = t.captureBtn;
  document.getElementById("closeCameraBtn").textContent = t.closeCameraBtn;
  document.getElementById("removeBtn").textContent = t.removeBtn;
  document.getElementById("btnText").textContent = t.analyzeBtn;
  document.getElementById("confidenceLabel").textContent = t.confidenceLabel;
  document.getElementById("descLabel").textContent = t.descLabel;
  document.getElementById("fertLabel").textContent = t.fertLabel;
  document.getElementById("pestLabel").textContent = t.pestLabel;
  document.getElementById("organicLabel").textContent = t.organicLabel;
  document.getElementById("prevLabel").textContent = t.prevLabel;
  document.getElementById("resetBtn").textContent = t.resetBtn;
  document.getElementById("aboutTitle").textContent = t.aboutTitle;
  document.getElementById("aboutSubtitle").textContent = t.aboutSubtitle;
  document.getElementById("aboutAiTitle").textContent = t.aboutAiTitle;
  document.getElementById("aboutAiText").textContent = t.aboutAiText;
  document.getElementById("aboutSmartTitle").textContent = t.aboutSmartTitle;
  document.getElementById("aboutSmartText").textContent = t.aboutSmartText;
  document.getElementById("aboutMobileTitle").textContent = t.aboutMobileTitle;
  document.getElementById("aboutMobileText").textContent = t.aboutMobileText;
  document.getElementById("footerText").textContent = t.footerText;
  document.getElementById("chatTitle").textContent = t.chatTitle;
  document.getElementById("chatSubtitle").textContent = t.chatSubtitle;
  document.getElementById("chatInput").placeholder = t.chatPlaceholder;
  document.getElementById("sendChatBtn").textContent = t.chatSend;
  document.getElementById("quick1").textContent = t.quick1;
  document.getElementById("quick2").textContent = t.quick2;
  document.getElementById("quick3").textContent = t.quick3;
  document.getElementById("quick4").textContent = t.quick4;
  document.getElementById("speakResultBtn").textContent = t.speakBtn;

  chatMessages.innerHTML = "";
  appendMessage(t.welcomeChat, "bot-message");
}

fileInput.addEventListener("change", (e) => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

openCameraBtn.addEventListener("click", async () => {
  try {
    stopCamera();
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    cameraVideo.srcObject = cameraStream;
    dropZone.style.display = "none";
    previewContainer.style.display = "none";
    cameraPreviewBox.style.display = "block";
    resultSection.style.display = "none";
  } catch (error) {
    showError(translations[currentLanguage].cameraError);
  }
});

captureBtn.addEventListener("click", () => {
  if (!cameraStream) {
    showError(translations[currentLanguage].captureError);
    return;
  }

  const width = cameraVideo.videoWidth;
  const height = cameraVideo.videoHeight;

  if (!width || !height) {
    showError(translations[currentLanguage].captureError);
    return;
  }

  cameraCanvas.width = width;
  cameraCanvas.height = height;

  const ctx = cameraCanvas.getContext("2d");
  ctx.drawImage(cameraVideo, 0, 0, width, height);

  cameraCanvas.toBlob((blob) => {
    if (!blob) {
      showError(translations[currentLanguage].captureError);
      return;
    }

    const capturedFile = new File([blob], "captured_leaf.png", { type: "image/png" });
    handleFile(capturedFile);
    stopCamera();
    cameraPreviewBox.style.display = "none";
  }, "image/png");
});

closeCameraBtn.addEventListener("click", () => {
  stopCamera();
  cameraPreviewBox.style.display = "none";
  dropZone.style.display = "block";
});

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  cameraVideo.srcObject = null;
}

function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    showError(translations[currentLanguage].invalidImage);
    return;
  }

  selectedFile = file;
  const reader = new FileReader();

  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    dropZone.style.display = "none";
    cameraPreviewBox.style.display = "none";
    previewContainer.style.display = "block";
    analyzeBtn.disabled = false;
    resultSection.style.display = "none";
  };

  reader.readAsDataURL(file);
}

removeBtn.addEventListener("click", () => {
  selectedFile = null;
  fileInput.value = "";
  imagePreview.src = "";
  stopCamera();
  dropZone.style.display = "block";
  cameraPreviewBox.style.display = "none";
  previewContainer.style.display = "none";
  analyzeBtn.disabled = true;
  resultSection.style.display = "none";
});

analyzeBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  setLoading(true);
  resultSection.style.display = "none";

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await fetch("/predict", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.error) {
      showError(data.error);
    } else {
      displayResult(data);
    }
  } catch (err) {
    showError(translations[currentLanguage].connectError);
  } finally {
    setLoading(false);
  }
});

function displayResult(data) {
  latestResultData = data;

  let diseaseName = data.disease;
  let description = data.description;
  let fertilizer = data.fertilizer;
  let pesticide = data.pesticide;
  let organic = data.organic_solution;
  let prevention = data.prevention;

  if (currentLanguage === "ta") {
    diseaseName = resultTranslations.ta[data.disease] || data.disease;
    const tamilInfo = diseaseInfoTamil[data.disease];
    if (tamilInfo) {
      description = tamilInfo.description;
      fertilizer = tamilInfo.fertilizer;
      pesticide = tamilInfo.pesticide;
      organic = tamilInfo.organic_solution;
      prevention = tamilInfo.prevention;
    }
  }

  const badge = document.getElementById("diseaseBadge");
  badge.textContent = diseaseName;
  badge.className = "disease-badge disease";

  const fill = document.getElementById("confidenceFill");
  document.getElementById("confidenceText").textContent = data.confidence + "%";
  fill.style.width = "0%";

  setTimeout(() => {
    fill.style.width = data.confidence + "%";
  }, 50);

  fill.style.background = "#ef5350";

  document.getElementById("resDescription").textContent = description || "-";
  document.getElementById("resFertilizer").textContent = fertilizer || "-";
  document.getElementById("resPesticide").textContent = pesticide || "-";
  document.getElementById("resOrganic").textContent = organic || "-";
  document.getElementById("resPrevention").textContent = prevention || "-";

  resultSection.style.display = "block";
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setLoading(state) {
  analyzeBtn.disabled = state;
  btnText.style.display = state ? "none" : "inline";
  btnLoader.style.display = state ? "inline-block" : "none";
}

function showError(msg) {
  errorToast.textContent = "⚠ " + msg;
  errorToast.style.display = "block";
  setTimeout(() => {
    errorToast.style.display = "none";
  }, 4000);
}

document.getElementById("resetBtn").addEventListener("click", () => {
  removeBtn.click();
  window.scrollTo({
    top: document.getElementById("upload-section").offsetTop - 80,
    behavior: "smooth"
  });
});

chatToggle.addEventListener("click", () => {
  chatbox.style.display = chatbox.style.display === "none" ? "flex" : "none";
});

closeChatBtn.addEventListener("click", () => {
  chatbox.style.display = "none";
});

sendChatBtn.addEventListener("click", sendChatMessage);

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendChatMessage();
});

quickBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    chatInput.value = btn.textContent;
    sendChatMessage();
  });
});

function sendChatMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage(message, "user-message");
  chatInput.value = "";

  setTimeout(() => {
    const reply = getBotReply(message);
    appendMessage(reply, "bot-message");
    speakText(reply);
  }, 400);
}

function appendMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = className;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(message) {
  const msg = message.toLowerCase();

  if (currentLanguage === "ta") {
    if (msg.includes("brown") || msg.includes("பழுப்பு")) {
      return "Brown spot என்பது ஒரு பூஞ்சை நோய். இலைகளில் பழுப்பு நிற வட்ட புள்ளிகள் தோன்றும். பொட்டாசியம் உள்ள சமநிலை உரம் மற்றும் தேவையான பூஞ்சை மருந்து பயன்படுத்தலாம்.";
    }
    if (msg.includes("blight") || msg.includes("உலர்ச்சி") || msg.includes("bacterial")) {
      return "Bacterial leaf blight இலைகளில் மஞ்சள் முதல் பழுப்பு வரை நீளமான கோடுகளை உண்டாக்கும். சமநிலை NPK உரம் மற்றும் உள்ளூர் ஆலோசனைப்படி சரியான மருந்து பயன்படுத்தலாம்.";
    }
    if (msg.includes("organic") || msg.includes("இயற்கை")) {
      return "வேப்பெண்ணெய், வேப்பச்சாறு, மற்றும் bio-control முறைகள் சில நோய்களுக்கு இயற்கையான உதவியாக இருக்கும்.";
    }
    if (msg.includes("fertilizer") || msg.includes("உரம்")) {
      return "பயிர் நிலை மற்றும் நோயை பொறுத்து உரம் மாறும். பொதுவாக சமநிலை NPK மற்றும் போதுமான பொட்டாசியம் நல்லது.";
    }
    if (msg.includes("prevent") || msg.includes("தடுப்பு")) {
      return "தடுப்பு முறைகள்: ஆரோக்கியமான விதை, வயல் சுத்தம், பாதிக்கப்பட்ட இலைகளை அகற்றுதல், நீர் தேக்கம் தவிர்த்தல்.";
    }
    return "நீங்கள் நோய், உரம், மருந்து, இயற்கை தீர்வு, தடுப்பு குறித்து கேட்கலாம். உதாரணம்: 'பழுப்பு புள்ளி நோய் என்றால் என்ன?'";
  } else {
    if (msg.includes("brown spot")) {
      return "Brown spot is a fungal disease. It causes brown circular or oval spots on leaves. Use balanced fertilizer with enough potassium and appropriate fungicide if recommended locally.";
    }
    if (msg.includes("blight") || msg.includes("bacterial")) {
      return "Bacterial leaf blight causes yellow to brown streaks on paddy leaves. Use balanced NPK fertilizer and proper treatment based on local agriculture guidance.";
    }
    if (msg.includes("organic")) {
      return "Neem oil, neem extract, and some bio-control methods can help as organic support for crop disease management.";
    }
    if (msg.includes("fertilizer")) {
      return "Fertilizer depends on disease and crop stage. Usually balanced NPK and sufficient potassium are helpful.";
    }
    if (msg.includes("prevent") || msg.includes("prevention")) {
      return "Prevention tips: use healthy seeds, avoid standing water, remove infected leaves, and maintain field hygiene.";
    }
    return "You can ask about disease symptoms, fertilizer, pesticide, organic solution, or prevention. Example: 'What is brown spot?'";
  }
}

function speakText(text) {
  if (!text) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  if (currentLanguage === "ta") {
    utterance.lang = "ta-IN";
  } else {
    utterance.lang = "en-US";
  }

  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

speakResultBtn.addEventListener("click", () => {
  if (!latestResultData) return;

  let speechText = "";

  if (currentLanguage === "ta") {
    const tamilDisease = resultTranslations.ta[latestResultData.disease] || latestResultData.disease;
    const tamilInfo = diseaseInfoTamil[latestResultData.disease];
    if (tamilInfo) {
      speechText = `${tamilDisease}. நம்பிக்கை ${latestResultData.confidence} சதவீதம். ${tamilInfo.description} உரம்: ${tamilInfo.fertilizer} மருந்து: ${tamilInfo.pesticide} இயற்கை தீர்வு: ${tamilInfo.organic_solution} தடுப்பு: ${tamilInfo.prevention}`;
    }
  } else {
    speechText = `${latestResultData.disease}. Confidence ${latestResultData.confidence} percent. ${latestResultData.description} Fertilizer: ${latestResultData.fertilizer}. Pesticide: ${latestResultData.pesticide}. Organic solution: ${latestResultData.organic_solution}. Prevention: ${latestResultData.prevention}.`;
  }

  speakText(speechText);
});

initLanguage();