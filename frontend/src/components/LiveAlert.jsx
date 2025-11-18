export function showLiveAlert(title, message) {
  const alert = document.createElement("div");
  alert.className =
    "fixed top-5 right-5 bg-[#113556] border border-blue-400 text-white px-4 py-3 rounded-lg shadow-xl animate-slideIn z-50";
  alert.innerHTML = `
    <div class="font-semibold">${title}</div>
    <div class="text-sm text-gray-300">${message}</div>
  `;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.transition = "0.5s";

    setTimeout(() => alert.remove(), 500);
  }, 4000);
}
