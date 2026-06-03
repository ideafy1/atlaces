// test-email.js
console.log("Testing email backend...");

fetch('http://localhost:5000/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    toEmail: 'brainheal.in@gmail.com', // Sending email to yourself for testing
    bookingId: 'test-room-1234'
  })
})
.then(res => res.json())
.then(data => {
  console.log("Response from server:", data);
  if (data.success) {
    console.log("SUCCESS! Please check your Gmail inbox.");
  } else {
    console.log("FAILED. Read the error message above.");
  }
})
.catch(err => {
  console.error("Fetch Error: Make sure you started the backend server first (bun run backend)!");
});
