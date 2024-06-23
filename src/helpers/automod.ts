import { Config } from "@/config";

// Function to call the prediction endpoint
export async function predict(message: string) {
  const inputData = {
    input: message,
  }
  const requestOptions = {
    method: 'POST',
    port: 80,
    headers: {
      'Content-Type': 'application/json', // Specify that the request body is in JSON format
    },
    body: JSON.stringify(inputData),
  };
  try {
    // Make the POST request and await the response
    const response = await fetch(Config.automod.api_url, requestOptions);

    // Check if the response status code indicates success (e.g., 200 OK)
    if (response.ok) {
      const data = await response.json(); // Parse the response as JSON
      console.log('Response data:', data.response);
      return data.response; // Ensure the parsed response is returned
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    console.error('Error making prediction:', error);
    return null;
  }
}
