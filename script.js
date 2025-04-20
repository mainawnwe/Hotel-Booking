const roomSelect = document.getElementById("roomType");
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const priceSummary = document.getElementById("priceSummary");

function setMinDates() {
  const today = new Date().toISOString().split("T")[0];
  checkinInput.setAttribute("min", today);
  checkinInput.addEventListener("change", () => {
    checkoutInput.setAttribute("min", checkinInput.value);
    calculatePrice();
  });
  checkoutInput.addEventListener("change", calculatePrice);
}
setMinDates();

function calculatePrice() {
  const checkin = new Date(checkinInput.value);
  const checkout = new Date(checkoutInput.value);
  const days = (checkout - checkin) / (1000 * 3600 * 24);
  const selectedOption = roomSelect.options[roomSelect.selectedIndex];
  const pricePerNight = selectedOption.dataset.price;

  if (days > 0 && pricePerNight) {
    const total = days * parseInt(pricePerNight);
    priceSummary.innerText = `Total: $${total} for ${days} night(s)`;
    return { days, total };
  } else {
    priceSummary.innerText = '';
    return { days: 0, total: 0 };
  }
}

roomSelect.addEventListener("change", calculatePrice);

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const guests = document.getElementById("guests").value;
  const roomType = roomSelect.value;
  const checkin = checkinInput.value;
  const checkout = checkoutInput.value;
  const { days, total } = calculatePrice();

  if (!roomType || !checkin || !checkout || days <= 0) {
    alert("Please select valid dates and room type.");
    return;
  }

  const confirmationHTML = `
    <div style="border:1px solid #ccc; padding:15px; background:#fff;">
      <h3>Booking Summary</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Guests:</strong> ${guests}</p>
      <p><strong>Room:</strong> ${roomType}</p>
      <p><strong>Check-in:</strong> ${checkin}</p>
      <p><strong>Check-out:</strong> ${checkout}</p>
      <p><strong>Total Nights:</strong> ${days}</p>
      <p><strong>Total Price:</strong> $${total}</p>
      <p style="color:green; font-weight:bold;">Thank you! Your booking is confirmed.</p>
    </div>
  `;

  document.getElementById("confirmation").innerHTML = confirmationHTML;
  document.getElementById("bookingForm").reset();
  priceSummary.innerText = '';
});
