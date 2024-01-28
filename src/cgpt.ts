const chatgpt = async (params, api_secret_key: string) => {
  try {
    const response = await fetch(
      "https://flag.smarttrot.com/v1/chat/completions",
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
