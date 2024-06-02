document.getElementById('post').addEventListener('click', async () => {
  const message = document.getElementById('message').value;

  // Save message to local storage
  saveMessageToLocal(message);

  const response = await fetch('/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  if (response.ok) {
    loadMessages();
    document.getElementById('message').value = '';
  } else {
    console.error('Failed to post message:', response.statusText);
  }
});

document.getElementById('connect').addEventListener('click', async () => {
  if (!navigator.bluetooth) {
    console.error('Web Bluetooth API is not available in this browser.');
    return;
  }

  try {
    console.log('Requesting Bluetooth Device...');

    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['generic_access', 'generic_attribute'] // Broader services
    });

    console.log('Device selected:', device);

    const server = await device.gatt.connect();
    console.log('Connected to GATT Server:', server);

    // Get all primary services
    const services = await server.getPrimaryServices();
    console.log('Available services:', services);

    // Iterate through services and log their characteristics
    for (const service of services) {
      console.log(`Service: ${service.uuid}`);
      const characteristics = await service.getCharacteristics();
      characteristics.forEach(characteristic => {
        console.log(`Characteristic: ${characteristic.uuid}`);
      });
    }

    // Optionally, you can attempt to read from one of the discovered characteristics
    // const exampleService = services[0]; // Use an appropriate index based on your device's available services
    // const exampleCharacteristic = await exampleService.getCharacteristic(services[0].uuid);
    // const value = await exampleCharacteristic.readValue();
    // console.log(`Value: ${value}`);

  } catch (error) {
    console.error('Error:', error);
  }
});

async function loadMessages() {
  const response = await fetch('/messages');
  const messages = await response.json();
  displayMessages(messages);
}

function displayMessages(messages) {
  const messagesList = document.getElementById('messages');
  messagesList.innerHTML = '';
  messages.forEach(message => {
    const li = document.createElement('li');
    li.textContent = message;
    messagesList.appendChild(li);
  });
}

function saveMessageToLocal(message) {
  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));
  displayMessages(messages);
}

// Load messages from local storage initially
window.addEventListener('load', () => {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  displayMessages(messages);
});
