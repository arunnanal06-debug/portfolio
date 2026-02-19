/* =========================
   Scroll Frame Animation
========================= */
const frameCount = 240;
const canvas = document.getElementById("frameCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = index =>
  `frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

const images = [];
let img = new Image();

for (let i = 1; i <= frameCount; i++) {
  const image = new Image();
  image.src = currentFrame(i);
  images.push(image);
}

images[0].onload = () => context.drawImage(images[0], 0, 0, canvas.width, canvas.height);

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const frameIndex = Math.min(frameCount - 1, Math.floor((scrollTop / maxScroll) * frameCount));
  requestAnimationFrame(() => {
    context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
  });
});


/* =========================
   Chatbot (Strict Resume Context)
========================= */

const RESUME_CONTEXT = `
Name: Arunkumar V
Education: BE Electronics and Engineering (2023–2027), Government College of Engineering Tirunelveli, CGPA 7.6
Skills: Basic Python Knowledge, Problem Solving, Data Logic
Interests: Software Development, Data Logic, Gym, Badminton
Languages: English, Tamil
Goal: Seeking entry-level software role or internship
Traits: Disciplined, creative, consistent, self-learning individual
`;

const SYSTEM_PROMPT = `
You are a resume assistant chatbot.
Answer ONLY using the provided resume context.
If the answer is not in the resume, reply:
"Information not available in the resume."
Resume Context:
${RESUME_CONTEXT}
`;

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message);
  input.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_OPENAI_API_KEY"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        temperature: 0
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    appendMessage("Bot", reply);
  } catch (error) {
    appendMessage("Bot", "Error connecting to chatbot.");
  }
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
