const chatgpt = async (params, api_secret_key: string, base_url:string) => {
  try {
    const response = await fetch(
      `${base_url}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + api_secret_key,
        },
        body: JSON.stringify(params),
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export default chatgpt;
